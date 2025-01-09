import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const ColorCustomizer = () => {
  const [mainColor, setMainColor] = useState('#4A90E2');
  const [lightColor, setLightColor] = useState('#E8F1FC');
  
  const hexToHSL = (hex) => {
    hex = hex.replace(/#/g, '');
    
    let r = parseInt(hex.substring(0, 2), 16) / 255;
    let g = parseInt(hex.substring(2, 4), 16) / 255;
    let b = parseInt(hex.substring(4, 6), 16) / 255;
    
    let max = Math.max(r, g, b);
    let min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      let d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      
      h /= 6;
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  };

  const HSLToHex = (h, s, l) => {
    s /= 100;
    l /= 100;

    let c = (1 - Math.abs(2 * l - 1)) * s;
    let x = c * (1 - Math.abs((h / 60) % 2 - 1));
    let m = l - c/2;
    let r = 0, g = 0, b = 0;

    if (0 <= h && h < 60) {
      r = c; g = x; b = 0;
    } else if (60 <= h && h < 120) {
      r = x; g = c; b = 0;
    } else if (120 <= h && h < 180) {
      r = 0; g = c; b = x;
    } else if (180 <= h && h < 240) {
      r = 0; g = x; b = c;
    } else if (240 <= h && h < 300) {
      r = x; g = 0; b = c;
    } else if (300 <= h && h < 360) {
      r = c; g = 0; b = x;
    }

    r = Math.round((r + m) * 255).toString(16).padStart(2, '0');
    g = Math.round((g + m) * 255).toString(16).padStart(2, '0');
    b = Math.round((b + m) * 255).toString(16).padStart(2, '0');

    return `#${r}${g}${b}`;
  };

  // 檢查是否為黑色或白色
  const isBlackOrWhite = (hex) => {
    const rgb = {
      r: parseInt(hex.slice(1, 3), 16),
      g: parseInt(hex.slice(3, 5), 16),
      b: parseInt(hex.slice(5, 7), 16)
    };
    
    // 檢查是否為白色（所有值都接近 255）
    const isWhite = rgb.r > 250 && rgb.g > 250 && rgb.b > 250;
    // 檢查是否為黑色（所有值都接近 0）
    const isBlack = rgb.r < 5 && rgb.g < 5 && rgb.b < 5;
    
    return { isBlack, isWhite };
  };

  // 調整淺色系計算方式，加入黑白色特殊處理
  useEffect(() => {
    const { isBlack, isWhite } = isBlackOrWhite(mainColor);
    
    if (isBlack) {
      // 如果是黑色，使用相同的淺灰色
      setLightColor('#E0E0E0');
    } else if (isWhite) {
      // 如果是白色，使用淺灰色
      setLightColor('#E0E0E0');
    } else {
      // 一般顏色的處理
      const hsl = hexToHSL(mainColor);
      const lightHex = HSLToHex(hsl.h, 50, 90);
      setLightColor(lightHex);
    }
  }, [mainColor]);

  // 驗證並格式化輸入的色碼
  const validateAndFormatHex = (hex) => {
    // 移除空格和 # 符號
    hex = hex.replace(/\s/g, '').replace('#', '');
    
    // 檢查是否為有效的六位色碼
    const isValid = /^[0-9A-Fa-f]{6}$/.test(hex);
    
    if (isValid) {
      return `#${hex.toUpperCase()}`;
    }
    return null;
  };

  const handleMainColorChange = (value) => {
    const formattedHex = validateAndFormatHex(value);
    if (formattedHex) {
      setMainColor(formattedHex);
    }
  };

  const handleLightColorChange = (value) => {
    const formattedHex = validateAndFormatHex(value);
    if (formattedHex) {
      setLightColor(formattedHex);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="space-y-4">
            <label className="block text-sm font-medium">
              選擇主要顏色
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="color"
                value={mainColor}
                onChange={(e) => setMainColor(e.target.value)}
                className="h-10 w-20"
              />
              <Input
                value={mainColor}
                onChange={(e) => handleMainColorChange(e.target.value)}
                className="w-32 uppercase"
              />
            </div>
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium">
              對應的淺色系
            </label>
            <div className="flex items-center space-x-4">
              <div
                className="h-10 w-20 rounded border"
                style={{ backgroundColor: lightColor }}
              />
              <Input
                value={lightColor}
                onChange={(e) => handleLightColorChange(e.target.value)}
                className="w-32 uppercase"
              />
            </div>
          </div>

          <div className="mt-8 space-y-4">
            <h3 className="text-lg font-medium">預覽效果</h3>
            <div className="space-y-4 p-4 border rounded">
              <div className="h-12 rounded" style={{ backgroundColor: mainColor }} />
              <div className="h-12 rounded" style={{ backgroundColor: lightColor }} />
              
              <div className="mt-4 space-y-2">
                <div className="flex space-x-2">
                  <div className="h-8 w-8 rounded" style={{ backgroundColor: mainColor }} />
                  <div className="h-8 flex-1 rounded" style={{ backgroundColor: lightColor }} />
                </div>
                <div className="flex space-x-2">
                  <div className="h-8 w-8 rounded" style={{ backgroundColor: lightColor }} />
                  <div className="h-8 flex-1 rounded" style={{ backgroundColor: mainColor }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ColorCustomizer;