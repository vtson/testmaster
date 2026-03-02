/**
 * download-images.mjs
 * 
 * One-time script to:
 * 1. Scan card data JS files for CDN image URLs
 * 2. Download all images to public/CardImages/
 * 3. Replace CDN URLs with local paths in the JS files
 */

import fs from 'node:fs'
import path from 'node:path'
import { pipeline } from 'node:stream/promises'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const CARDS_DIR = path.join(__dirname, 'src', 'lib', 'master-strike-data', 'dist', 'definitions', 'cards')
const PUBLIC_DIR = path.join(__dirname, 'public')
const CDN_BASE = 'https://nyc3.digitaloceanspaces.com/bageltop/'
const LOCAL_BASE = '/'

const CONCURRENCY = 10
const RETRY_COUNT = 3

// ─── Step 1: Extract all unique CDN URLs ────────────────────────────────

function extractImageUrls() {
    const urls = new Set()
    const jsFiles = fs.readdirSync(CARDS_DIR).filter(f => f.endsWith('.js') && f !== 'index.js')

    for (const file of jsFiles) {
        const content = fs.readFileSync(path.join(CARDS_DIR, file), 'utf-8')
        const regex = /imageUrl:\s*"(https:\/\/nyc3\.digitaloceanspaces\.com\/bageltop\/[^"]+)"/g
        let match
        while ((match = regex.exec(content)) !== null) {
            urls.add(match[1])
        }
    }

    return [...urls]
}

// ─── Step 2: Download images with concurrency control ───────────────────

async function downloadFile(url, destPath, attempt = 1) {
    try {
        const dir = path.dirname(destPath)
        fs.mkdirSync(dir, { recursive: true })

        const res = await fetch(url)
        if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`)

        const fileStream = fs.createWriteStream(destPath)
        await pipeline(res.body, fileStream)
        return true
    } catch (err) {
        if (attempt < RETRY_COUNT) {
            await new Promise(r => setTimeout(r, 1000 * attempt))
            return downloadFile(url, destPath, attempt + 1)
        }
        console.error(`  ✗ FAILED: ${url} — ${err.message}`)
        return false
    }
}

async function downloadAll(urls) {
    console.log(`\nFound ${urls.length} unique image URLs\n`)

    let completed = 0
    let failed = 0
    let skipped = 0

    // Process in batches
    for (let i = 0; i < urls.length; i += CONCURRENCY) {
        const batch = urls.slice(i, i + CONCURRENCY)
        const results = await Promise.all(
            batch.map(async (url) => {
                const relativePath = url.replace(CDN_BASE, '')
                const destPath = path.join(PUBLIC_DIR, relativePath)

                // Skip if already downloaded
                if (fs.existsSync(destPath)) {
                    skipped++
                    return true
                }

                const ok = await downloadFile(url, destPath)
                if (ok) {
                    completed++
                } else {
                    failed++
                }
                return ok
            })
        )

        const progress = Math.min(i + CONCURRENCY, urls.length)
        process.stdout.write(`\r  Downloading... ${progress}/${urls.length} (${completed} new, ${skipped} skipped, ${failed} failed)`)
    }

    console.log(`\n\n  ✓ Done: ${completed} downloaded, ${skipped} already existed, ${failed} failed\n`)
    return failed
}

// ─── Step 3: Replace CDN URLs in JS files ───────────────────────────────

function replaceUrls() {
    const jsFiles = fs.readdirSync(CARDS_DIR).filter(f => f.endsWith('.js') && f !== 'index.js')
    let totalReplacements = 0

    for (const file of jsFiles) {
        const filePath = path.join(CARDS_DIR, file)
        const content = fs.readFileSync(filePath, 'utf-8')
        const updated = content.replaceAll(CDN_BASE, LOCAL_BASE)

        const count = (content.match(new RegExp(CDN_BASE.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length
        if (count > 0) {
            fs.writeFileSync(filePath, updated, 'utf-8')
            totalReplacements += count
        }
    }

    console.log(`  ✓ Replaced ${totalReplacements} URLs across ${jsFiles.length} files\n`)
}

// ─── Main ───────────────────────────────────────────────────────────────

async function main() {
    console.log('╔══════════════════════════════════════════╗')
    console.log('║   Master Strike — CDN Image Downloader   ║')
    console.log('╚══════════════════════════════════════════╝')

    // Step 1
    console.log('\n[1/3] Scanning card data for image URLs...')
    const urls = extractImageUrls()

    // Step 2
    console.log('[2/3] Downloading images...')
    const failures = await downloadAll(urls)

    if (failures > 0) {
        console.log(`  ⚠ ${failures} images failed. Re-run the script to retry them.\n`)
    }

    // Step 3
    console.log('[3/3] Replacing CDN URLs with local paths...')
    replaceUrls()

    console.log('All done! Images are in public/CardImages/')
}

main().catch(console.error)
