import { FC, useEffect } from "react";

interface HomeAssistantSwordProps {
    swordIsGlowing: boolean;
    homeAssistantIp: string | undefined;
}

export const HomeAssistantSword : FC<HomeAssistantSwordProps> = ({swordIsGlowing, homeAssistantIp}) => {

    const homeAssistantApiLink = `http://${homeAssistantIp}:8123/api/webhook`;

    useEffect(() => {
        if (swordIsGlowing) {
            fetch(`${homeAssistantApiLink}/sword_on`, 
                {method: 'POST'}
            );
        }
        else {
            fetch(`${homeAssistantApiLink}/sword_off`, 
                {method: 'POST'}
            );
        }
    }, [swordIsGlowing]);

    return (<div>
        {swordIsGlowing}
    </div>)
};