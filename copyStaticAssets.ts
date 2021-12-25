import * as shell from 'shelljs'

// todo: ignore *.d.ts
shell.cp('-R', 'src/public/js/lib', 'dist/public/js/')
shell.cp('-R', 'src/public/fonts', 'dist/public/')
shell.cp('-R', 'src/public/images', 'dist/public/')
