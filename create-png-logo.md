# Converting SVG Logo to PNG

To create a PNG version of the CostGuard logo for better social media compatibility, you can use one of these methods:

## Method 1: Online Converters
1. Go to [convertio.co](https://convertio.co/svg-png/) or [cloudconvert.com](https://cloudconvert.com/svg-to-png)
2. Upload the `costguard-logo.svg` file
3. Set dimensions to 1200x630px (optimal for social media)
4. Download as `costguard-logo.png`
5. Place it in the `public/` directory

## Method 2: Using Figma (Free)
1. Open [Figma](https://figma.com)
2. Create new file
3. Import the SVG
4. Resize to 1200x630px
5. Export as PNG

## Method 3: Command Line (if you have ImageMagick)
```bash
# Install ImageMagick first
brew install imagemagick  # macOS
# or
sudo apt-get install imagemagick  # Ubuntu

# Convert SVG to PNG
magick costguard-logo.svg -resize 1200x630 costguard-logo.png
```

## Method 4: Using Inkscape
```bash
# Install Inkscape
brew install inkscape  # macOS

# Convert SVG to PNG
inkscape costguard-logo.svg --export-type=png --export-filename=costguard-logo.png --export-width=1200 --export-height=630
```

After creating the PNG, update the HTML meta tags to use the PNG version:
```html
<meta property="og:image" content="/costguard-logo.png" />
<meta name="twitter:image" content="/costguard-logo.png" />
```
