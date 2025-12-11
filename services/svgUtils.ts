
import { IconConfig, IconType } from '../types';

/**
 * Modifies an SVG string with user configurations using DOMParser for robust XML manipulation.
 * Ensures strict adherence to SVG standards and explicit attribute values.
 */
export const processSvgContent = (svgContent: string, config: IconConfig, type: IconType): string => {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgContent, 'image/svg+xml');
    const svg = doc.querySelector('svg');

    if (!svg) return svgContent;

    // 1. Dimensions
    svg.setAttribute('width', config.size.toString());
    svg.setAttribute('height', config.size.toString());
    
    // Ensure viewBox exists
    if (!svg.getAttribute('viewBox')) {
      svg.setAttribute('viewBox', '0 0 24 24');
    }

    // 2. Remove potentially conflicting inline styles or deprecated attributes
    svg.removeAttribute('style');
    svg.removeAttribute('class');
    
    // Helper to clean child paths
    const cleanChildren = (element: Element) => {
        const children = element.querySelectorAll('*');
        children.forEach(child => {
            // Remove explicit color/stroke attributes so they inherit from root
            // unless we want to preserve specific multi-color paths (not typical for icon sets like this)
            child.removeAttribute('fill');
            child.removeAttribute('stroke');
            child.removeAttribute('stroke-width');
            child.removeAttribute('style');
        });
    };

    cleanChildren(svg);

    // 3. Apply Attributes based on Type
    if (type === 'solid') {
      // Solid: Fill = Color, Stroke = None
      svg.setAttribute('fill', config.color);
      svg.setAttribute('stroke', 'none');
      // Remove stroke-width entirely for solid or set to 0
      svg.removeAttribute('stroke-width'); 
    } else {
      // Line: Fill = None, Stroke = Color
      svg.setAttribute('fill', 'none');
      svg.setAttribute('stroke', config.color);
      svg.setAttribute('stroke-width', config.strokeWidth.toString());
      svg.setAttribute('stroke-linecap', 'round');
      svg.setAttribute('stroke-linejoin', 'round');
    }

    // 4. Namespace (required for standalone SVG files)
    if (!svg.getAttribute('xmlns')) {
      svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    }

    return new XMLSerializer().serializeToString(svg);
  } catch (e) {
    console.error("Error processing SVG", e);
    return svgContent;
  }
};

export const downloadSvg = (filename: string, content: string) => {
  const blob = new Blob([content], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.svg`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Internal helper to create a canvas from SVG
const createPngCanvas = (svgContent: string, size: number): Promise<HTMLCanvasElement> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    // For high-res output (e.g. retina or just better quality), we can scale up
    const scaleFactor = 2; 
    canvas.width = size * scaleFactor;
    canvas.height = size * scaleFactor;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        reject(new Error("Could not get canvas context"));
        return;
    }

    // Process SVG to ensure it has dimensions for the image load
    // We force the SVG to be the render size
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgContent, 'image/svg+xml');
    const svg = doc.querySelector('svg');
    if (svg) {
        svg.setAttribute('width', (size * scaleFactor).toString());
        svg.setAttribute('height', (size * scaleFactor).toString());
        svgContent = new XMLSerializer().serializeToString(svg);
    }

    const img = new Image();
    const svgBlob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      resolve(canvas);
    };

    img.onerror = (e) => {
        URL.revokeObjectURL(url);
        reject(e);
    };

    img.src = url;
  });
};

export const downloadPng = async (filename: string, svgContent: string, size: number) => {
  try {
      const canvas = await createPngCanvas(svgContent, size);
      const pngUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = pngUrl;
      link.download = `${filename}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  } catch (e) {
      console.error("Failed to generate PNG for download", e);
  }
};

export const copySvgToClipboard = async (content: string) => {
  try {
    await navigator.clipboard.writeText(content);
    return true;
  } catch (err) {
    console.error('Failed to copy SVG code', err);
    return false;
  }
};

export const copyPngToClipboard = async (svgContent: string, size: number) => {
    try {
        const canvas = await createPngCanvas(svgContent, size);
        
        // Convert canvas to blob
        const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/png'));
        
        if (!blob) throw new Error("Failed to create PNG blob");

        // Use ClipboardItem API
        const item = new ClipboardItem({ 'image/png': blob });
        await navigator.clipboard.write([item]);
        return true;
    } catch (err) {
        console.error('Failed to copy PNG image', err);
        return false;
    }
};
