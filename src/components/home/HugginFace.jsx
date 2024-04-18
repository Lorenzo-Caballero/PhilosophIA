import React, { useEffect } from "react";
import { HfInference } from "@huggingface/inference";

const HugginFace = () => {

    useEffect(() => {
        const fetchData = async () => {
            const hf = new HfInference("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");
            const model = "Salesforce/blip-image-captioning-large";
const imageUrl="https://th.bing.com/th/id/R.b728a0c08767649312ed24d88bca5ba5?rik=78Pp6WA13kVk0A&riu=http%3a%2f%2ftjbishopfineart.com%2fpics%2fevery-single-simpsons-character.jpg&ehk=51HBGedV2sEy09y1ZYwP5qqRqD2MAp6Zz%2b%2b967wpgXc%3d&risl=&pid=ImgRaw&r=0";
            try {
                const response = await fetch(imageUrl);
                const blob = await response.blob();

                const imageResult = await hf.imageToText({
                    data: blob,
                    model: model,
                });
                console.log(imageResult.generated_text)
               const resultTranslate= await hf.translation({
                    model: 'facebook/mbart-large-50-many-to-many-mmt',
                    inputs: imageResult.generated_text,
                    parameters: {
                        "src_lang": "en_XX",
                        "tgt_lang": "es_XX"
                    }
                })

                console.log(resultTranslate)
            } catch (error) {
                console.error("Error:", error);
            }
        };

        fetchData();
    }, []);

    return (
        <div>

        </div>
    );
};

export default HugginFace;
