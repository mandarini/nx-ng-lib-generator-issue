/*
 * Config file for elf cli
 * this is used to generate repository file with command:
 * npx @ngneat/elf-cli repo
 * pass --dry-run flag to test it
 */
module.exports = {
  cli: {
    repoTemplate: 'class',
    inlineStoreInClass: true,
    //  idKey: '_id',
    repoLibrary: 'state',
    plugins: ['@ngneat/elf-cli-ng'],
  },
};
