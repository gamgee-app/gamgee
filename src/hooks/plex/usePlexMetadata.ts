import {useEffect, useState} from "react";
import {GetMediaMetaDataResponse} from "@lukehagar/plexjs/sdk/models/operations";
import {PlexAPI} from "@lukehagar/plexjs";

export const usePlexMetadata = (plexApi: PlexAPI | undefined, ratingKey: number | undefined) => {
    const [metadataResponse, setMetadataResponse] = useState<GetMediaMetaDataResponse | null>(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;

        if (ratingKey) {
            plexApi?.library.getMediaMetaData({ratingKey})
                .then((response) => {
                    if (isMounted) setMetadataResponse(response);
                })
                .catch((err) => {
                    if (isMounted) setError(err);
                });
        } else {
            if (isMounted) setMetadataResponse(null);
        }

        return () => {
            isMounted = false;
        };
    }, [ratingKey]);

    return { metadata: metadataResponse?.object?.mediaContainer?.metadata?.at(0), error };
};
