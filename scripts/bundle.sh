#!/bin/bash
name="Currency Converter"
description="Get prices in your local currency (currently only PLN to GBP, EUR and USD are supported"
version="0.1"

manifest="{
  \"name\": \"$name\",
  \"description\" : \"$description\",
  \"version\": \"$version\",

  \"manifest_version\": 2,

  \"browser_action\": {
    \"default_icon\": \"icons/64x64.png\",
    \"default_title\": \"Currency Converter\"
  },
  \"icons\": {
    \"16\": \"icons/16x16.png\",
    \"64\": \"icons/64x64.png\",
    \"128\": \"icons/128x128.png\"
  },
  \"background\": {
    \"scripts\": [
      \"lib.bundle.js\",
      \"main.bundle.js\"
    ]
  },
  \"content_scripts\": [ {
    \"all_frames\": true,
    \"js\": [
      \"lib.bundle.js\",
      \"front.bundle.js\"
    ],
    \"matches\": [ \"http://*/*\", \"https://*/*\", \"file://*/*\" ]
  } ],
  \"permissions\": [
    \"activeTab\",
    \"tabs\",
    \"storage\",
    \"http://*/\",
    \"https://*/\",
    \"file://*/\"
  ]
}"

npx webpack

echo $manifest > dist/manifest.json

# cp front.js dist/
# cp main.js dist/
cp LICENSE dist/
cp -r icons dist/icons
