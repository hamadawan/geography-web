"use client";

import { useEffect } from "react";
import { useList as useCountryList } from "@/lib/api-client/country";
import { useList as useStateList } from "@/lib/api-client/state";
import { useList as usePostalCodeList } from "@/lib/api-client/postal-code";
import { useSelectionStore } from "@/lib/store/selection-store";

export const useMapLayout = () => {
    const { selectedCountry, selectedState, selectedZip, setCountries } = useSelectionStore(s => s);

    const { data: countriesData, isLoading: isCountriesLoading } = useCountryList({
        paginate: false,
    });

    useEffect(() => {
        if (countriesData?.countries) {
            setCountries(countriesData.countries);
        }
    }, [countriesData, setCountries]);

    const { isLoading: isStatesLoading } = useStateList({
        country: selectedCountry?.code,
        paginate: false,
    });

    const { isLoading: isPostalCodesLoading } =
        usePostalCodeList({
            state: selectedState?.code,
            paginate: selectedZip?.code !== "all",
        });

    return {
        isCountriesLoading,
        isStatesLoading,
        isPostalCodesLoading,
    };
};
