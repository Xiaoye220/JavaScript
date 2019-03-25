## PlistParser

[Resources](https://github.com/pugetive/plist_parser)

### Usage

Include 'plist_parser.js' via an HTML script tag or Titanium.include().

```
var jsonString = PlistParser.parse(xmlString);
```

**New** Convert Objects into Plist XML

```
var plistString = PlistParser.toPlist(obj);
```



### Fix BUG

Fix the BUG that when json to plist，Array will be parsed into Dictionary