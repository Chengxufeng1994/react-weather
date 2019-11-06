import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { ThemeProvider } from 'emotion-theming';
import styled from '@emotion/styled'
import WeatherCard from './WeatherCard'
import WeatherSetting from './WeatherSetting';
import WeatherMomentApi from './WeatherMomentApi';
import { findLocation } from '../utils'

const theme = {
    light: {
        backgroundColor: '#ededed',
        foregroundColor: '#f9f9f9',
        boxShadow: '0 1px 3px 0 #999999',
        titleColor: '#212121',
        temperatureColor: '#757575',
        textColor: '#828282',
    },
    dark: {
        backgroundColor: '#1F2022',
        foregroundColor: '#121416',
        boxShadow:
            '0 1px 4px 0 rgba(12, 12, 13, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.15)',
        titleColor: '#f9f9fa',
        temperatureColor: '#dddddd',
        textColor: '#cccccc',
    }
}

const Container = styled.div`
background-color: ${({ theme }) => theme.backgroundColor};
height: 100%;
display: flex;
align-items: center;
justify-content: center;
`;

const App = () => {
    // STEP 1：從 localStorage 取出 cityName，並取名為 storageCity
    const storageCity = localStorage.getItem('cityName');
    // STEP 2：若storgeCity存在則作為currentCity的預設值，否則為台北市
    const [currentCity, setCurrentCity] = useState(storageCity || '臺北市');
    const [currentTheme, setCurrentTheme] = useState('light');
    const currentLocation = findLocation(currentCity) || {};
    const [moment] = WeatherMomentApi(currentLocation.sunriseCityName);

    useEffect(() => {
        setCurrentTheme(moment === 'day' ? 'light' : 'dark')
    }, [moment])

    useEffect(() => {
        localStorage.setItem('cityName', currentCity)
    }, [currentCity])

    return (
        <ThemeProvider theme={theme[currentTheme]}>
            <Container >
                <Router>
                    <Switch>
                        <Route exact path="/"
                            render={(props) => (
                                <WeatherCard {...props}
                                    currentLocation={currentLocation}
                                />
                            )}
                        />
                        <Route exact path="/setting"
                            render={(props) => (
                                <WeatherSetting {...props}
                                    cityName={currentLocation.cityName}
                                    setCurrentCity={setCurrentCity} />
                            )}
                        />
                    </Switch>
                </Router>
            </Container >
        </ThemeProvider>
    )
}

export default App