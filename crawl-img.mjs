/**
 * crawl-img.mjs
 * 
 * Crawl all files from https://master-strike.com/img/ by:
 * 1. Fetching all JS bundles referenced in the site's HTML
 * 2. Extracting all img/* file references from the bundles
 * 3. Downloading each file to public/img/
 */

import fs from 'node:fs'
import path from 'node:path'
import { pipeline } from 'node:stream/promises'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PUBLIC_DIR = path.join(__dirname, 'public')
const BASE_URL = 'https://master-strike.com'
const CONCURRENCY = 5
const RETRY_COUNT = 3

// ─── Step 1: Fetch index.html and extract JS bundle URLs ─────────────────

async function getJsBundleUrls() {
    console.log('  Fetching index.html...')
    const res = await fetch(BASE_URL)
    const html = await res.text()

    const urls = new Set()
    // Match both <script src="..."> and <link href="..." rel="prefetch/preload">
    const scriptRegex = /(?:src|href)="(\/js\/[^"]+\.js)"/g
    let match
    while ((match = scriptRegex.exec(html)) !== null) {
        urls.add(BASE_URL + match[1])
    }

    return [...urls]
}

// ─── Step 2: Fetch JS bundles and extract img/ references ────────────────

async function extractImgPaths(jsUrls) {
    const imgPaths = new Set()

    for (const url of jsUrls) {
        const name = url.split('/').pop()
        process.stdout.write(`  Scanning ${name}...`)

        try {
            const res = await fetch(url)
            const js = await res.text()

            // Match patterns like: t.p+"img/filename.hash.ext"
            // and e.p+"img/filename.hash.ext"
            // and module.exports=n.p+"img/filename.hash.ext"
            const regex = /[a-z]\.p\+["']([^"']*img\/[^"']+)["']/g
            let match
            while ((match = regex.exec(js)) !== null) {
                imgPaths.add(match[1])
            }

            // Also match direct "/img/" paths
            const directRegex = /["'](\/img\/[^"']+)["']/g
            while ((match = directRegex.exec(js)) !== null) {
                imgPaths.add(match[1].replace(/^\//, ''))
            }

            console.log(' ✓')
        } catch (err) {
            console.log(` ✗ (${err.message})`)
        }
    }

    return [...imgPaths]
}

// ─── Step 3: Download files ──────────────────────────────────────────────

async function downloadFile(url, destPath, attempt = 1) {
    try {
        const dir = path.dirname(destPath)
        fs.mkdirSync(dir, { recursive: true })

        const res = await fetch(url)
        if (!res.ok) throw new Error(`HTTP ${res.status}`)

        const fileStream = fs.createWriteStream(destPath)
        await pipeline(res.body, fileStream)
        return true
    } catch (err) {
        if (attempt < RETRY_COUNT) {
            await new Promise(r => setTimeout(r, 1000 * attempt))
            return downloadFile(url, destPath, attempt + 1)
        }
        return false
    }
}

async function downloadAll(imgPaths) {
    console.log(`\n  Found ${imgPaths.length} img files to download\n`)

    let completed = 0
    let failed = 0
    let skipped = 0

    for (let i = 0; i < imgPaths.length; i += CONCURRENCY) {
        const batch = imgPaths.slice(i, i + CONCURRENCY)
        await Promise.all(
            batch.map(async (imgPath) => {
                const url = BASE_URL + '/' + imgPath
                const destPath = path.join(PUBLIC_DIR, imgPath)

                if (fs.existsSync(destPath)) {
                    skipped++
                    return
                }

                const ok = await downloadFile(url, destPath)
                if (ok) {
                    completed++
                } else {
                    failed++
                    console.error(`  ✗ FAILED: ${imgPath}`)
                }
            })
        )

        const progress = Math.min(i + CONCURRENCY, imgPaths.length)
        process.stdout.write(`\r  Progress: ${progress}/${imgPaths.length} (${completed} new, ${skipped} skipped, ${failed} failed)`)
    }

    console.log(`\n\n  ✓ Done: ${completed} downloaded, ${skipped} already existed, ${failed} failed\n`)
    return failed
}

// ─── Main ────────────────────────────────────────────────────────────────

async function main() {
    console.log('╔══════════════════════════════════════════════════╗')
    console.log('║   Master Strike — /img/ Directory Crawler       ║')
    console.log('╚══════════════════════════════════════════════════╝')

    // Step 1: Get JS bundle URLs
    console.log('\n[1/3] Finding JS bundles...')
    const jsUrls = await getJsBundleUrls()
    console.log(`  Found ${jsUrls.length} JS bundles`)

    // Step 2: Extract img paths
    console.log('\n[2/3] Extracting img/ references from bundles...')
    const imgPaths = await extractImgPaths(jsUrls)

    // Show what we found
    console.log('\n  Files discovered:')
    for (const p of imgPaths.sort()) {
        console.log(`    ${p}`)
    }

    // Step 3: Download
    console.log('\n[3/3] Downloading files...')
    const failures = await downloadAll(imgPaths)

    if (failures > 0) {
        console.log(`  ⚠ ${failures} files failed. Re-run to retry.\n`)
    }

    console.log('All done! Files are in public/img/')
}

main().catch(console.error)
