import * as React from 'react';
import './App.css';

import logo from './logo.svg';

import { InitialCities } from './Components/InitialCities';

interface IAppState {
    initialCities: {[city: string]: number};
    rounds: [{[city: string]: number}];
}

const initialCities = {
    'Atlanta': 2,
    'Chicago': 1,
    'New York': 3,
    'Washington': 3,
};

class App extends React.Component<{}, IAppState> {
    private static getInitialRound(cities: {[city: string]: number}): {[city: string]: number} {
        const round: {[city: string]: number} = {};
        // tslint:disable-next-line:forin
        for (const city in cities) {
            round[city] = 0;
        }

        return round;
    }

    private static getDifference(a: {[city: string]: number}, b: {[city: string]: number}): {[city: string]: number} {
        const diff = {};
        // tslint:disable-next-line:forin
        for (const city in a) {
            diff[city] = a[city] - b[city];
        }

        return diff;
    }

    private static getRemainingCount(round: {[city: string]: number}): number {
        let count = 0;
        // tslint:disable-next-line:forin
        for (const city in round) {
            count += round[city];
        }

        return count;
    }

    private static getProbabilities(round: {[city: string]: number}): {[city: string]: number} {
        const totalCount = App.getRemainingCount(round);
        const result = {};

        // tslint:disable-next-line:forin
        for (const city in round) {
            result[city] = round[city] / totalCount;
        }

        return result;
    }

    private static getCityProbabilities(state: IAppState): {[city: string]: number} {
        const roundIndex = state.rounds.length - 1;
        const currentRound = state.rounds[roundIndex];
        const prevRound = state.rounds.length >= 2 ? state.rounds[roundIndex - 1] : state.initialCities;
        const diff = App.getDifference(prevRound, currentRound);

        const knownRemaining = App.getRemainingCount(diff);
        if (knownRemaining <= 0) {
            // Equal probability with initial count
            return App.getProbabilities(App.getDifference(state.initialCities, currentRound));
        } else {
            return App.getProbabilities(diff);
        }
    }

    constructor(props: {}) {
        super(props);

        this.state = {
            initialCities,
            rounds: [App.getInitialRound(initialCities)]
        };

        this.onEpidemic = this.onEpidemic.bind(this);
        this.onInitialCityCountChanged = this.onInitialCityCountChanged.bind(this);
        this.onInitialCityAdd = this.onInitialCityAdd.bind(this);
        this.onRoundCountChanged = this.onRoundCountChanged.bind(this);
    }

    public render() {
        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <h1 className="App-title">Welcome to Pandemic Calculator</h1>
                </header>
                <InitialCities
                    initialCities={this.state.initialCities}
                    cityProbabilities={App.getCityProbabilities(this.state)}
                    rounds={this.state.rounds}
                    onCountChanged={this.onInitialCityCountChanged}
                    onCityAdd={this.onInitialCityAdd}
                    onEpidemic={this.onEpidemic}
                    onRoundCountChanged={this.onRoundCountChanged}
                />
            </div>
        );
    }

    private onInitialCityCountChanged(city: string, count: number): void {
        this.setState((prevState: IAppState, props: {}) => {
            const newInitialCities = Object.assign({}, prevState.initialCities);
            newInitialCities[city] = count;

            return {
                initialCities: newInitialCities
            };
        });
    }

    // TODO: add on rounds
    private onInitialCityAdd(city: string): void {
        this.setState((prevState: IAppState, props: {}) => {
            if (prevState.initialCities[city]) {
                return prevState;
            }

            const newInitialCities = Object.assign({}, prevState.initialCities);
            newInitialCities[city] = 0;

            return {
                initialCities: newInitialCities
            };
        });
    }

    private onRoundCountChanged(roundIndex: number, city: string, count: number): void {
        this.setState((prevState: IAppState, props: {}) => {
            prevState.rounds[roundIndex][city] = count;

            return {
                rounds: prevState.rounds
            };
        });
    }

    private onEpidemic(): void {
        this.setState((prevState: IAppState, props: {}) => {
            prevState.rounds.push(App.getInitialRound(prevState.initialCities));

            return {
                rounds: prevState.rounds
            };
        });
    }
}

export default App;
