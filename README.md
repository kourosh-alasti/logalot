# loglitely

[![npm version](https://badge.fury.io/js/loglitely.svg)](https://badge.fury.io/js/@kourosh-alasti/logger)

[Examples](./examples/default.ts) &bullet; [Documentation](https://github.com/kourosh-alasti/logalot/wiki) &bullet; [Changelog](./CHANGELOG.md) &bullet; [License](./LICENSE)

A Zero Dependency TypeScript logging library

<div align="center"> <img src="examples/screenshot.png" alt="configured preset"> </div>

## Table of Contents

- [loglitely](#logelitely)
- [Table of Contents](#table-of-contents)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)

## Installation

Add the package to your project via [npm](https://docs.npmjs.com/)

```bash
npm install loglitely
```

## Support Matrix

| Version | Supported |
| :-----: | :-------: |
| >=1.2.0 |    ✅    |

## Usage

There are two ways to add a logger to your application. The quickest way is using the default configuration.

```typescript
import { createLogger } from 'loglitely';

const logger = createLogger();

logger.log("Hello World!");
logger.warn("Hello World!");
logger.debug("Hello World!");
logger.error("Hello World!");
logger.info("Hello World!");
```

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md)
