# eslint-plugin-z-lint

我自己定义着玩的插件

## Installation

You'll first need to install [ESLint](https://eslint.org/):

```sh
npm i eslint --save-dev
```

Next, install `eslint-plugin-z-lint`:

```sh
npm install eslint-plugin-z-lint --save-dev
```

## Usage

Add `z-lint` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": [
        "z-lint"
    ]
}
```


Then configure the rules you want to use under the rules section.

```json
{
    "rules": {
        "z-lint/rule-name": 2
    }
}
```

## Supported Rules

* Fill in provided rules here


