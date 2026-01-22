# 3D Model Compression Guide

## Current State
- **File**: `/public/models/camera.glb`
- **Size**: 18MB (uncompressed)
- **Target**: 2MB (90% reduction)

## Option 1: Online Compression (Easiest)
1. Go to: https://gltf.report/
2. Upload `camera.glb`
3. Click "Export" > Enable "Draco compression"
4. Set compression level to 10
5. Download compressed file
6. Replace `/public/models/camera.glb`

## Option 2: Using gltf-transform CLI
```bash
# Install globally
npm install -g @gltf-transform/cli

# Compress with Draco
gltf-transform draco public/models/camera.glb public/models/camera.glb \
  --method edgebreaker \
  --encoder-speed 0 \
  --encoder-method 1 \
  --quantize-position 14 \
  --quantize-normal 10 \
  --quantize-texcoord 12
```

## Option 3: Using Blender (Most Control)
1. Open camera.glb in Blender
2. File > Export > glTF 2.0
3. Enable "Draco mesh compression"
4. Set compression level: 10
5. Export

## What This Does
- **Mesh Compression**: Reduces vertex data by 80-90%
- **Texture Optimization**: Maintains visual quality
- **Animation Preservation**: Keeps all animations intact
- **Load Time**: 18MB @ 4G = 10-15s → 2MB = 1-2s

## Expected Results
| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| File Size | 18MB | ~2MB | 90% |
| Load Time (4G) | 10-15s | 1-2s | 85% |
| Parse Time | 800-1200ms | 100-200ms | 85% |
| Visual Quality | 100% | 98% | Negligible |

## After Compression
No code changes needed! The path `/models/camera.glb` will automatically load the compressed version.

---

## Alternative: Use a Smaller Model
If you have access to the source 3D file:
1. Reduce polygon count by 50% (users won't notice)
2. Optimize textures (1024x1024 max)
3. Remove unused materials
4. Export with Draco enabled

This can get you to <1MB total!
