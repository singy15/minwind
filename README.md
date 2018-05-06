
# minwind
Minimal application launcher

## How to use

* Press Ctrl + Up to show input form.
* Type `@set [key]=[value]` to register.
* Type `@config [key]=[value]` to configure.
* Type `@exit` to quit application.
* Type `@clear` to delete all registered keys.
* Press Esc to hide input form.

### Example

Register application.

```
@set baz=C:\foo\bar\baz.exe
@set baz="C:\Program Files\foo\bat\baz.exe"
```

Register directory.

```
@set baz=explorer C:\foo\bar\baz
@set baz=explorer "C:\foo bar\baz"
```


## Configuration

* shortcut : Global shortcut to show input form.
* opacity : Opacity of input form.

## How to packaging

### 1.Install "asar" and "electron-packager"
```
npm install -g asar
npm install -g electron-packager
```

### 2.Archiving and packaging with electron-packager
```
electron-packager . minwind --platform=win32 --arch=x64 --electronVersion=2.0.0 --icon=./icon.ico --asar
electron-packager . minwind --platform=win32 --arch=ia32 --electronVersion=2.0.0 --icon=./icon.ico --asar
```

