import { prefixPluginTranslations } from "@strapi/helper-plugin";
import pluginPkg from "../../package.json";
import pluginId from "./pluginId";
import Initializer from "./components/Initializer";
import Wysiwyg from "./components/Wysiwyg";
import MyCompo from "./components/MyCompo";
import { getTrad } from "./utils";
import pluginPermissions from "./permissions";

const name = pluginPkg.strapi.name;

export default {
    register(app) {
        app.addFields({ type: "wysiwyg", Component: Wysiwyg });
        app.createSettingSection(
            {
                id: pluginId,
                intlLabel: {
                    id: `${pluginId}.plugin.name`,
                    defaultMessage: "TinyMCE",
                },
            },
            [
                {
                    intlLabel: {
                        id: getTrad("settings.page-title"),
                        defaultMessage: "Configuration",
                    },
                    id: "settings",
                    to: `/settings/${pluginId}`,
                    Component: async () => {
                        return import("./pages/Settings");
                    },
                    permissions: pluginPermissions["settings"],
                },
            ]
        );
        app.registerPlugin({
            id: pluginId,
            initializer: Initializer,
            isReady: false,
            name,
        });
    },

    bootstrap(app) {
        app.injectContentManagerComponent('editView', 'right-links', {
            name: 'strapi-plugin-tinymce-my-compo',
            Component: MyCompo,
        });
    },
    async registerTrads({ locales }) {
        const importedTrads = await Promise.all(
            locales.map((locale) => {
                return import(
                    /* webpackChunkName: "translation-[request]" */ `./translations/${locale}.json`
                )
                    .then(({ default: data }) => {
                        return {
                            data: prefixPluginTranslations(data, pluginId),
                            locale,
                        };
                    })
                    .catch(() => {
                        return {
                            data: {},
                            locale,
                        };
                    });
            })
        );

        return Promise.resolve(importedTrads);
    },
};
