import React, {useEffect, useState} from "react";
import {
    CustomBoxFullWidth,
    CustomStackFullWidth,
    SliderCustom,
} from "../../../../styled-components/CustomStyles.style";
import {Alert, alpha, NoSsr, styled, Typography, useTheme} from "@mui/material";
import {Box, Stack} from "@mui/system";
import CustomImageContainer from "../../../CustomImageContainer";
import {useDispatch, useSelector} from "react-redux";
import {useRouter} from "next/router";
import {getCurrentModuleType} from "../../../../helper-functions/getCurrentModuleType";
import {settings} from "./sliderSettings";
import Slider from "react-slick";
import {IsSmallScreen} from "../../../../utils/CommonValues";
import {setSelectedModule} from "../../../../redux/slices/utils";
import {AlertTitle} from "@mui/lab";
import {useTranslation} from "react-i18next";
import {useGetAllModules} from "../../../../api-manage/hooks/custom-hooks/useGetAllModules";

const CardWrapper = styled(Stack)(({theme, bg_change}) => ({
    backgroundColor:
        bg_change === "true"
            ? theme.palette.primary.main
            : theme.palette.background.paper,
    color: bg_change === "true" ? theme.palette.whiteContainer.main : "inherit",
    width: "163px",
    height: "55px",
    padding: "12px",
    border: `1px solid ${alpha(theme.palette.neutral[400], 0.2)}`,
    borderRadius: "10px",
    cursor: "pointer",
    position: 'relative',

}));
const ImageWrapper = styled(Box)(({theme}) => ({
    width: "33px",
    height: "33px",
    position: "relative",
}));
const Card = ({item, configData}) => {
    const [isSelected, setIsSelected] = useState(null);
    const router = useRouter();
    const theme = useTheme();
    const dispatch = useDispatch();
    useEffect(() => {
        setIsSelected(getCurrentModuleType())
    }, [])
    const handleClick = () => {
        setIsSelected(item?.module_type);
        dispatch(setSelectedModule(item));
        localStorage.setItem("module", JSON.stringify(item));
        router.replace("/home");
    };

    return (
        <CardWrapper
            onClick={handleClick}
            bg_change={isSelected === item?.module_type ? "true" : "false"}
            direction='row'
            alignItems='center'
            justifyContent='space-between'
            spacing={.4}
        >
            <Typography
                sx={{
                    cursor: "pointer",
                }}
                variant={IsSmallScreen() ? "h7" : "h6"}
            >
                {item?.module_name}
            </Typography>
            <ImageWrapper>
                <CustomImageContainer
                    src={`${configData?.base_urls?.module_image_url}/${item?.icon}`}
                    alt={item?.module_name}
                    height="100%"
                    width="100%"
                    obejctfit="contained"
                    borderRadius="5px"
                />
            </ImageWrapper>
        </CardWrapper>
    );
};

const ModuleSelectionRaw = (props) => {
    const {isSmall} = props;
    const {configData} = useSelector((state) => state.configData);
    const {data, isLoading} = useGetAllModules()
    const {t} = useTranslation()
    return (
        <NoSsr>
            {!isLoading && isSmall ? (
                <CustomBoxFullWidth sx={{mt: "15px"}}>
                    {
                        data && data?.length > 0 ? <SliderCustom>
                            <Slider {...settings}>
                                {data?.length > 0 &&
                                    data.map((item, index) => {
                                        return (
                                            <Card key={index} item={item} configData={configData}/>
                                        );
                                    })}
                            </Slider>
                        </SliderCustom> : <Alert severity="error">
                            <AlertTitle>{t("No module found")}</AlertTitle>
                            {t('Contact with the site owner to activate modules.')}
                        </Alert>
                    }

                </CustomBoxFullWidth>
            ) : (
                <>
                    {
                        data && data?.length > 0 ? <CustomStackFullWidth
                            flexDirection="row"
                            alignItems="center"
                            flexWrap="wrap"
                            gap="15px"
                            mt="30px"
                        >
                            {data.map((item, index) => {
                                return <Card key={index} item={item} configData={configData}/>;
                            })}
                        </CustomStackFullWidth> : <>{data && <Alert severity="error">
                            <AlertTitle>{t("No module found")}</AlertTitle>
                            {t('Contact with the site owner to activate modules.')}
                        </Alert>}</>
                    }
                </>

            )}
        </NoSsr>
    );
};

ModuleSelectionRaw.propTypes = {};

export default ModuleSelectionRaw;
