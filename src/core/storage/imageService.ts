export const applyIndustrialHDR = async (base64Str: string): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return resolve(base64Str);
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      ctx.filter = 'contrast(1.2) brightness(1.1) saturate(1.1)';
      ctx.drawImage(canvas, 0, 0);
      resolve(canvas.toDataURL('image/jpeg', 0.85));
    };
  });
};