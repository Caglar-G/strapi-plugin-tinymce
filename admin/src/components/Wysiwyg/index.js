import React, { useState } from "react";
import PropTypes from "prop-types";
import { Stack } from "@strapi/design-system/Stack";
import { Box } from "@strapi/design-system/Box";
import { Button } from "@strapi/design-system/Button";
import { Typography } from "@strapi/design-system/Typography";
import Landscape from "@strapi/icons/Landscape";
import MediaLib from "../MediaLib";
import Editor from "../Editor";
import { useIntl } from "react-intl";
import mammoth  from "mammoth/mammoth.browser";


const Wysiwyg = ({
    name,
    onChange,
    value,
    intlLabel,
    disabled,
    error,
    description,
    required,
}) => {
    const { formatMessage } = useIntl();
    const [mediaLibVisible, setMediaLibVisible] = useState(false);

    

    const handleToggleMediaLib = () => setMediaLibVisible((prev) => !prev);

    const handleChangeAssets = (assets) => {
        //let newValue = value ? value : "";

        assets.map((asset) => {
            
           
            if (asset.mime.includes("image")) {
                const imgTag = `<p><img src="${asset.url}" alt="${asset.alt}"></img></p>`;
                newValue = `${newValue}${imgTag}`;
            }
            if (asset.mime.includes("video")) {
                const videoTag = `<video><source src="${asset.url}" alt="${asset.alt}"</source></video>`;
                newValue = `${newValue}${videoTag}`;
            }
            if (asset.mime.includes("word")) {
                fetch( asset.url)
                .then( r => r.arrayBuffer() )
                .then( buffer => { // note this is already an ArrayBuffer
                    mammoth.convertToHtml({arrayBuffer: buffer})
                    .then(function(result){
                        var html = result.value; // The generated HTML
                        var messages = result.messages; // Any messages, such as warnings during conversion
                        debugger;
                        newValue = `${newValue}${html}`;
                        onChange({ target: { name, value: newValue } });
                    })
                    .catch(function(error) {
                        console.error(error);
                    });
                });

              
            }
        });

        handleToggleMediaLib();
    };

    return (
        <>
            <Stack size={1}>
                <Box>
                    <Typography variant="pi" fontWeight="bold">
                        {formatMessage(intlLabel)}
                    </Typography>
                    {required && (
                        <Typography
                            variant="pi"
                            fontWeight="bold"
                            textColor="danger600"
                        >
                            *
                        </Typography>
                    )}
                </Box>
                <Button
                    startIcon={<Landscape />}
                    variant="secondary"
                    fullWidth
                    onClick={handleToggleMediaLib}
                >
                    Media library
                </Button>
                <Button
                    startIcon={<Landscape />}
                    variant="secondary"
                    fullWidth
                    onClick={handleToggleMediaLib}
                >
                    Add Docx
                </Button>
                <Editor
                    disabled={disabled}
                    name={name}
                    onChange={onChange}
                    value={value}
                />
                {error && (
                    <Typography variant="pi" textColor="danger600">
                        {formatMessage({ id: error, defaultMessage: error })}
                    </Typography>
                )}
                {description && (
                    <Typography variant="pi">
                        {formatMessage(description)}
                    </Typography>
                )}
            </Stack>
            <MediaLib
                isOpen={mediaLibVisible}
                onChange={handleChangeAssets}
                onToggle={handleToggleMediaLib}
            />
            <style>{"\
                .tox-notification{\
                    display: none !important;\
                }\
            "}</style>
        </>
    );
};

Wysiwyg.defaultProps = {
    description: "",
    disabled: false,
    error: undefined,
    intlLabel: "",
    required: false,
    value: "",
};

Wysiwyg.propTypes = {
    description: PropTypes.shape({
        id: PropTypes.string,
        defaultMessage: PropTypes.string,
    }),
    disabled: PropTypes.bool,
    error: PropTypes.string,
    intlLabel: PropTypes.shape({
        id: PropTypes.string,
        defaultMessage: PropTypes.string,
    }),
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    required: PropTypes.bool,
    value: PropTypes.string,
};

export default Wysiwyg;
