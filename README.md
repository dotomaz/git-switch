# Git-Switch
A CLI utility that makes it easy to switch between several local branches that you are working on

## Overview
Are you constantly switching between several branches at the same time? It can become hard to keep track of the branch
names as you switch between them. `git-switch` makes this easy. It parses the reflog for branches that you were working 
on and list them in a menu in CLI that you can navigate with your cursor keys. Then it automatically checks out the
branch that you had selected.

## Installation
You need to have `nodejs` and `npm` installed.

The easiest way is to use `npx`.

```sh
npx @dotomaz/git-switch
```

You can also install it globally.

```sh
npm i -g @dotomaz/git-witch
git-switch
```

## Usage
Just run the command inside a git repo.

![Usage](usage.gif?raw=true "Usage")

```sh
git-switch --help
```

If you want to omit some branches, you can use the `--exclude` parameter.

```sh
git-switch --exclude=master,develop,release
```

You can also limit the number of branches that are returned.

```sh
git-switch --limit=5
```

To make your life easier you can create a alias. For instance in `zsh` you can put this at the end of your `~/.zshrc` file.

```sh
alias gsw="npx @dotomaz/git-switch --exclude=master,develop,release --limit=5"
```

## License
MIT
