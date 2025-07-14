---
title: $forEachObjectArray
description: $forEachObjectArray will execute an awaited command for each item in the object array.
id: forEachObjectArray
---

`$forEachObjectArray` will execute an awaited command for each item in the object array.

## Usage

```aoi
$forEachObjectArray[name;property;awaitedCommand;endCmd?]
```

## Parameters

| Field          | Type                                                                                              | Description                                               | Required |
| -------------- | ------------------------------------------------------------------------------------------------- | --------------------------------------------------------- | :------: |
| name           | [string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) | Array name.                                               |   true   |
| property       | [string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) | Array property.                                           |   true   |
| awaitedCommand | [string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) | Awaited command to executed.                              |   true   |
| endCmd?        | [string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) | Awaited command to executed when array ends.              |   false  |
