import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const javaDir=path.join(root,'android','app','src','main','java','com','nadmo','ai');
const gradlePath=path.join(root,'android','app','build.gradle');
fs.mkdirSync(javaDir,{recursive:true});

const mainActivity=`package com.nadmo.ai;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
  @Override
  public void onCreate(Bundle savedInstanceState) {
    registerPlugin(NadmoOCRPlugin.class);
    super.onCreate(savedInstanceState);
  }
}
`;

const plugin=`package com.nadmo.ai;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.util.Base64;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.google.mlkit.vision.common.InputImage;
import com.google.mlkit.vision.text.TextRecognition;
import com.google.mlkit.vision.text.TextRecognizer;
import com.google.mlkit.vision.text.latin.TextRecognizerOptions;

@CapacitorPlugin(name = "NadmoOCR")
public class NadmoOCRPlugin extends Plugin {
  @PluginMethod
  public void recognize(PluginCall call) {
    String data = call.getString("data");
    if (data == null || data.isEmpty()) {
      call.reject("Image data is required.");
      return;
    }

    try {
      int comma = data.indexOf(',');
      String encoded = comma >= 0 ? data.substring(comma + 1) : data;
      byte[] bytes = Base64.decode(encoded, Base64.DEFAULT);
      Bitmap bitmap = BitmapFactory.decodeByteArray(bytes, 0, bytes.length);
      if (bitmap == null) {
        call.reject("Unable to decode image.");
        return;
      }

      InputImage image = InputImage.fromBitmap(bitmap, 0);
      TextRecognizer recognizer = TextRecognition.getClient(TextRecognizerOptions.DEFAULT_OPTIONS);
      recognizer.process(image)
        .addOnSuccessListener(result -> {
          JSObject ret = new JSObject();
          ret.put("text", result.getText());
          call.resolve(ret);
          recognizer.close();
        })
        .addOnFailureListener(error -> {
          call.reject("Text recognition failed.", error);
          recognizer.close();
        });
    } catch (Exception error) {
      call.reject("OCR processing failed.", error);
    }
  }
}
`;

fs.writeFileSync(path.join(javaDir,'MainActivity.java'),mainActivity);
fs.writeFileSync(path.join(javaDir,'NadmoOCRPlugin.java'),plugin);

let gradle=fs.readFileSync(gradlePath,'utf8');
const dependency="implementation 'com.google.mlkit:text-recognition:16.0.1'";
if(!gradle.includes(dependency)){
  gradle=gradle.replace(/dependencies\s*\{/,m=>m+"\n    "+dependency);
  fs.writeFileSync(gradlePath,gradle);
}
console.log('NADMO OCR native bridge injected.');
