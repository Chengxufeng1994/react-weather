import { useCallback, useEffect, useState } from 'react'
import cwb from '../api/cwb'

async function fetchCurrentWeather(locationName) {
    const response = await cwb.get(`api/v1/rest/datastore/O-A0003-001?Authorization=CWB-CB28C34F-D97A-4212-BC23-A1E3C481FEC2&locationName=${locationName}`);
    const locationData = response.data.records.location[0];
    const weatherElements = locationData.weatherElement.reduce((needElements, item) => {
        if (['WDSD', 'TEMP', 'HUMD'].includes(item.elementName)) {
            needElements[item.elementName] = item.elementValue;
        }
        return needElements;
    }, {}
    );
    return {
        observationTime: locationData.time.obsTime,
        locationName: locationData.locationName,
        temperature: weatherElements.TEMP,
        windSpeed: weatherElements.WDSD,
        humid: weatherElements.HUMD,
    }
};

async function fetchWeatherForecast(cityName) {
    const response = await cwb.get(`api/v1/rest/datastore/F-C0032-001?Authorization=CWB-CB28C34F-D97A-4212-BC23-A1E3C481FEC2&locationName=${cityName}`);
    const locationData = response.data.records.location[0];
    const weatherElements = locationData.weatherElement.reduce((needElements, item) => {
        if (['Wx', 'PoP', 'CI'].includes(item.elementName)) {
            needElements[item.elementName] = item.time[0].parameter;
        }
        return needElements;
    }, {}
    );

    return {
        description: weatherElements.Wx.parameterName,
        weatherCode: weatherElements.Wx.parameterValue,
        rainPossibility: weatherElements.PoP.parameterName,
        comfortability: weatherElements.CI.parameterName,
    }
}

const useWeatherApi = (currentLocation) => {
    const cityName = currentLocation.cityName
    const locationName = currentLocation.locationName
    const [weatherElement, setWeatherElement] = useState({
        observationTime: new Date(),
        humid: 0,
        temperature: 0,
        windSpeed: 0,
        locationName: '',
        description: '',
        weatherCode: 0,
        rainPossibility: 0,
        comfortability: '',
        isLoading: true,
    });

    const fetchData = useCallback(() => {
        const fetchingData = async () => {
            const [currentWeather, weatherForecast] = await Promise.all([
                fetchCurrentWeather(locationName),
                fetchWeatherForecast(cityName),
            ]);

            setWeatherElement({
                ...currentWeather,
                ...weatherForecast,
                isLoading: false,
            })
        };

        setWeatherElement((prevState) => ({
            ...prevState,
            isLoading: true,
        }));

        fetchingData()
    }, [locationName, cityName]);

    useEffect(() => {
        fetchData();
    }, [fetchData])

    return [weatherElement, fetchData]
}

export default useWeatherApi;