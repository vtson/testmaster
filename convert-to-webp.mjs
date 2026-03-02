/**
 * convert-to-webp.mjs
 * 
 * Converts all PNG images in public/CardImages/ to WebP format,
 * then updates the card data JS files to reference .webp instead of .png.
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const IMAGES_DIR = path.join(__dirname, 'public', 'CardImages')
const CARDS_DIR = path.join(__dirname, 'src', 'lib', 'master-strike-data', 'dist', 'definitions', 'cards')

const WEBP_QUALITY = 85  // Good balance of quality vs size
const CONCURRENCY = 10

// ─── Step 1: Find all PNG files recursively ─────────────────────────────

function findPngs(dir) {
    const results = []
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const fullPath = path.join(dir, entry.name)
        if (entry.isDirectory()) {
            results.push(...findPngs(fullPath))
        } else if (entry.name.toLowerCase().endsWith('.png')) {
            results.push(fullPath)
        }
    }
    return results
}

// ─── Step 2: Convert PNGs to WebP ──────────────────────────────────────

async function convertToWebp(pngPath) {
    const webpPath = pngPath.replace(/\.png$/i, '.webp')

    // Skip if already converted
    if (fs.existsSync(webpPath)) {
        return { status: 'skipped', pngPath }
    }

    try {
        const pngSize = fs.statSync(pngPath).size
        await sharp(pngPath)
            .webp({ quality: WEBP_QUALITY })
            .toFile(webpPath)
        const webpSize = fs.statSync(webpPath).size

        return { status: 'converted', pngPath, pngSize, webpSize }
    } catch (err) {
        return { status: 'failed', pngPath, error: err.message }
    }
}

async function convertAll(pngFiles) {
    let converted = 0, skipped = 0, failed = 0
    let totalPngBytes = 0, totalWebpBytes = 0

    for (let i = 0; i < pngFiles.length; i += CONCURRENCY) {
        const batch = pngFiles.slice(i, i + CONCURRENCY)
        const results = await Promise.all(batch.map(convertToWebp))

        for (const r of results) {
            if (r.status === 'converted') {
                converted++
                totalPngBytes += r.pngSize
                totalWebpBytes += r.webpSize
            } else if (r.status === 'skipped') {
                skipped++
            } else {
                failed++
                console.error(`  ✗ ${r.pngPath}: ${r.error}`)
            }
        }

        const progress = Math.min(i + CONCURRENCY, pngFiles.length)
        process.stdout.write(`\r  Converting... ${progress}/${pngFiles.length}`)
    }

    const savedMB = ((totalPngBytes - totalWebpBytes) / 1024 / 1024).toFixed(1)
    const reduction = totalPngBytes > 0
        ? ((1 - totalWebpBytes / totalPngBytes) * 100).toFixed(1)
        : 0

    console.log(`\n\n  ✓ Converted: ${converted} | Skipped: ${skipped} | Failed: ${failed}`)
    console.log(`  ✓ Saved ${savedMB} MB (${reduction}% reduction)\n`)

    return failed
}

// ─── Step 3: Delete original PNGs ───────────────────────────────────────

function deletePngs(pngFiles) {
    let deleted = 0
    for (const p of pngFiles) {
        const webpPath = p.replace(/\.png$/i, '.webp')
        if (fs.existsSync(webpPath)) {
            fs.unlinkSync(p)
            deleted++
        }
    }
    console.log(`  ✓ Deleted ${deleted} original PNG files\n`)
}

// ─── Step 4: Update JS data files (.png → .webp) ───────────────────────

function updateJsReferences() {
    const jsFiles = fs.readdirSync(CARDS_DIR).filter(f => f.endsWith('.js') && f !== 'index.js')
    let totalReplacements = 0

    for (const file of jsFiles) {
        const filePath = path.join(CARDS_DIR, file)
        const content = fs.readFileSync(filePath, 'utf-8')
        const updated = content.replaceAll('.png"', '.webp"')

        const count = (content.match(/\.png"/g) || []).length
        if (count > 0) {
            fs.writeFileSync(filePath, updated, 'utf-8')
            totalReplacements += count
        }
    }

    console.log(`  ✓ Updated ${totalReplacements} references across ${jsFiles.length} files\n`)
}

// ─── Main ───────────────────────────────────────────────────────────────

async function main() {
    console.log('╔══════════════════════════════════════════╗')
    console.log('║   Master Strike — PNG → WebP Converter   ║')
    console.log('╚══════════════════════════════════════════╝')

    // Step 1
    console.log('\n[1/4] Scanning for PNG files...')
    const pngFiles = findPngs(IMAGES_DIR)
    console.log(`  Found ${pngFiles.length} PNG files\n`)

    if (pngFiles.length === 0) {
        console.log('  No PNGs found. Nothing to do.')
        return
    }

    // Step 2
    console.log(`[2/4] Converting to WebP (quality: ${WEBP_QUALITY})...`)
    const failures = await convertAll(pngFiles)

    if (failures > 0) {
        console.log(`  ⚠ ${failures} files failed. Re-run to retry.\n`)
    }

    // Step 3
    console.log('[3/4] Removing original PNGs...')
    deletePngs(pngFiles)

    // Step 4
    console.log('[4/4] Updating JS file references (.png → .webp)...')
    updateJsReferences()

    console.log('All done! Images are now WebP. 🎉')
}

main().catch(console.error)
