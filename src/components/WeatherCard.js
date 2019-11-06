import React from 'react';
import { Link } from 'react-router-dom'
import styled from '@emotion/styled';
import WeatherIcon from '../components/WeatherIcon';
import useWeatherApi from './useWeatherApi';
import WeatherMomentApi from './WeatherMomentApi';
import { ReactComponent as AirFlowIcon } from '../images/airFlow.svg';
import { ReactComponent as CogIcon } from '../images/cog.svg';
import { ReactComponent as LoadingIcon } from '../images/loading.svg';
import { ReactComponent as RainIcon } from '../images/rain.svg';
import { ReactComponent as RefreshIcon } from '../images/refresh.svg';

const WeatherCardWrapper = styled.div`
position: relative;
background-color: ${({ theme }) => theme.foregroundColor};
min-width: 360px;
box-shadow: 0 1px 3px 0 #999999;
box-sizing: border-box;
padding: 30px 15px;
`;

const Cog = styled(CogIcon)`
position:absolute;
top: 30px;
right: 15px;
width: 15px;
height: 15px;
cursor: pointer;
`

const Location = styled.div`
font-size: 28px;
color: ${({ theme }) => theme.titleColor};
margin-bottom: 20px;
`;

const Description = styled.div`
font-size:16px;
color: ${({ theme }) => theme.textColor};
margin-bottom: 30px;
`;

const CurrentWeather = styled.div`
display: flex;
justify-content: space-between;
align-items: center;
margin-bottom: 30px;
`;

const Temperature = styled.div`
display: flex;
color: ${({ theme }) => theme.temperatureColor};
font-size: 96px;
font-weight: 300;
`;

const Celsius = styled.div`
font-size: 42px;
font-weight: normal;
`

const AirFlow = styled.div`
display: flex;
align-items: center;
font-size: 16px;
font-weight: 300;
color: ${({ theme }) => theme.textColor};
margin-bottom: 20px;

svg {
    width: 25px;
    height: auto;
    margin-right: 30px;
}
`;

const Rain = styled.div`
display: flex;
align-items: center;
font-size: 16px;
font-weight: 300;
color: ${({ theme }) => theme.textColor};

svg {
    width: 25px;
    height: auto;
    margin-right: 30px;
}
`;

const Refresh = styled.div`
position: absolute;
right: 15px;
bottom: 15px;
font-size: 12px;
display: inline-flex;
align-items: flex-end;
color: ${({ theme }) => theme.textColor};

svg {
    margin-left: 10px;
    width: 15px;
    height: 15px;
    cursor: pointer;
    /* STEP 2：使用 rotate 動畫效果在 svg 圖示上 */
    animation: rotate 1.5s infinite linear;
    animation-duration: ${({ isLoading }) => (isLoading ? '1.5s' : '0s')}
  }

@keyframes rotate {
    from {
        transform: rotate(360deg)
    } to {
        transform: rotate(0deg)
    }
}
`

const WeatherCard = ({ currentLocation }) => {
    const [moment] = WeatherMomentApi();
    const [weatherElement, fetchData] = useWeatherApi(currentLocation);
    const {
        observationTime,
        // locationName,
        temperature,
        windSpeed,
        description,
        weatherCode,
        rainPossibility,
        comfortability,
        isLoading,
    } = weatherElement;

    return (
        <WeatherCardWrapper>
            <Link to="/setting">
                <Cog />
            </Link>
            <Location>
                {currentLocation.cityName}
            </Location>
            <Description>
                {description} {comfortability}
            </Description>
            <CurrentWeather>
                <Temperature>
                    {Math.round(temperature)} <Celsius>°C</Celsius>
                </Temperature>
                <WeatherIcon
                    currentWeatherCode={weatherCode}
                    moment={moment || 'day'}
                />
            </CurrentWeather>
            <AirFlow>
                <AirFlowIcon />
                {windSpeed} m/h
            </AirFlow>
            <Rain>
                <RainIcon />
                {Math.round(rainPossibility)} %
           </Rain>
            <Refresh onClick={() => fetchData()}
                isLoading={isLoading}>
                最後觀測時間:
                {new Intl.DateTimeFormat('zh-TW', {
                    hour: 'numeric',
                    minute: 'numeric'
                }).format(new Date(observationTime))}{' '}
                {isLoading ? <LoadingIcon /> : <RefreshIcon />}
            </Refresh>
        </WeatherCardWrapper>
    )
};

export default WeatherCard;