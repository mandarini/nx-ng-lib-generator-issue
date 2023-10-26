# Angular lib generator issue with directory + Lerna

Using `libs/*` as directory when generating an Angular library does not work with a specific Lerna config.

Error starts happening on Nx 17. Same lerna config works with Nx 16.10.

## Steps to reproduce

1. Install dependencies
2. Generate an Angular library:

```bash
nx g @nx/angular:library --name=my-lib --buildable=true --publishable=true --importPath=@myorg/my-lib  --directory=libs/my-lib  --projectNameAndRootFormat=as-provided --dry-run
```

This works. Let's see the Lerna config that breaks it.

## Lerna config that breaks it

```bash
git checkout lerna
```

In your `lerna.json` file, change `packages` to `libs/*`:

```json
{
  "$schema": "node_modules/lerna/schemas/lerna-schema.json",
  "packages": ["libs/*"],
  "version": "0.0.0",
   ...
}
```

Now

```bash
nx g @nx/angular:library --name=my-lib --buildable=true --publishable=true --importPath=@myorg/my-lib  --directory=libs/my-lib  --projectNameAndRootFormat=as-provided --dry-run
```

does NOT work.

But if the directory does not start with `libs`, it works:

```bash
nx g @nx/angular:library --name=my-lib --buildable=true --publishable=true --importPath=@myorg/my-lib  --directory=some-dir/my-lib  --projectNameAndRootFormat=as-provided --dry-run
```

## Nx 16.10 works

```bash
git checkout downgrade
```

Only changes are in `package.json` and `package-lock.json`.

`--directory=libs/*` works with Nx 16.10:

```bash
nx g @nx/angular:library --name=my-lib --buildable=true --publishable=true --importPath=@myorg/my-lib  --directory=libs/my-lib  --projectNameAndRootFormat=as-provided --dry-run
```
