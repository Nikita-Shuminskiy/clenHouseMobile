const { withDangerousMod } = require('expo/config-plugins');
const fs = require('fs');
const path = require('path');

/**
 * Allows non-modular header includes inside framework modules.
 *
 * With `useFrameworks: "static"` (required by @react-native-firebase, since the
 * Firebase SDK ships as static frameworks) the RNFB pods are built as framework
 * modules and import React headers like <React/RCTBridgeModule.h>. Under Xcode 26
 * the -Wnon-modular-include-in-framework-module warning is promoted to an error,
 * breaking the build. Setting CLANG_ALLOW_NON_MODULAR_INCLUDES_IN_FRAMEWORK_MODULES
 * for every pod target restores the previous behavior.
 *
 * See: https://github.com/expo/expo/issues/39607
 */
const SNIPPET = `
    # withFirebaseModularHeaders: let @react-native-firebase pods import non-modular
    # React headers under use_frameworks! :linkage => :static (Xcode 26). RNFB uses
    # textual #import <React/...> includes; with Clang modules enforced the build fails
    # with "declaration of 'RCTConvert' must be imported from module ... before it is
    # required". Disabling modules for the RNFB targets resolves it (headers still
    # resolve through HEADER_SEARCH_PATHS). See https://github.com/expo/expo/issues/39607
    installer.pods_project.targets.each do |target|
      target.build_configurations.each do |build_configuration|
        build_configuration.build_settings['CLANG_ALLOW_NON_MODULAR_INCLUDES_IN_FRAMEWORK_MODULES'] = 'YES'
        if target.name.start_with?('RNFB')
          build_configuration.build_settings['CLANG_ENABLE_MODULES'] = 'NO'
        end
      end
    end
`;

module.exports = function withFirebaseModularHeaders(config) {
  return withDangerousMod(config, [
    'ios',
    (config) => {
      const podfilePath = path.join(
        config.modRequest.platformProjectRoot,
        'Podfile'
      );
      let contents = fs.readFileSync(podfilePath, 'utf8');

      if (
        !contents.includes(
          'CLANG_ALLOW_NON_MODULAR_INCLUDES_IN_FRAMEWORK_MODULES'
        )
      ) {
        if (!/post_install do \|installer\|/.test(contents)) {
          throw new Error(
            'withFirebaseModularHeaders: could not find a post_install block in the generated Podfile.'
          );
        }
        contents = contents.replace(
          /post_install do \|installer\|/,
          (match) => `${match}\n${SNIPPET}`
        );
        fs.writeFileSync(podfilePath, contents);
      }

      return config;
    },
  ]);
};
