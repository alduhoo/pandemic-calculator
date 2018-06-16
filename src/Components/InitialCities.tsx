import * as React from 'react';

interface IInitialCitiesProps {
    initialCities: {[city:string]: number};
    cityProbabilities: {[city: string]: number};
    onCountChanged?: (city: string, count: number) => void;
    onEpidemic?: (roundIndex: number) => void;
    onRoundCountChanged?: (roundIndex: number, city: string, count: number) => void;
    onCityAdd?: (city: string) => void;
    rounds: [{[city: string]: number}];
}

export class InitialCities extends React.Component<IInitialCitiesProps, {}> {
    private newCityInput: HTMLInputElement;

    constructor(props: IInitialCitiesProps) {
        super(props);

        this.captureNewCityInputRef = this.captureNewCityInputRef.bind(this);
        this.onCityDecrement = this.onCityDecrement.bind(this);
        this.onEpidemic = this.onEpidemic.bind(this);
        this.onNewCityAdd = this.onNewCityAdd.bind(this);
    }

    public render(): JSX.Element {
        return (
            <table className="table table-bordered table-dark table-striped">
                <thead>
                    <tr>
                        <th scope="col">City</th>
                        <th scope="col">Initial Count</th>
                        {
                            this.props.rounds.map((r, i) => (
                                <th key={i}>Round {i}</th>
                            ))
                        }
                    </tr>
                </thead>
                <tbody>
                    {
                        Object.keys(this.props.initialCities).map(city => (
                            <tr key={city}>
                                <td>{city} - {`${(this.props.cityProbabilities[city] * 100).toFixed(2)}%`}</td>
                                <td>
                                    <button className="btn btn-sm btn-outline-primary" onClick={this.onCityDecrement.bind(this, city)}>-</button>
                                    <span style={{margin: "0 5px 0 5px"}}>{this.props.initialCities[city]}</span>
                                    <button className="btn btn-sm btn-outline-primary" onClick={this.onCityIncrement.bind(this, city)}>+</button>
                                </td>
                                {this.getRoundCols(city)}
                            </tr>
                        ))
                    }
                    <tr>
                        <td colSpan={2}>
                            <div className="input-group mb-3">
                                <input type="text" className="form-control" placeholder="New city" ref={this.captureNewCityInputRef} />
                                <div className="input-group-append">
                                    <button className="btn btn-outline-light" onClick={this.onNewCityAdd}>Add</button>
                                </div>
                            </div>
                        </td>
                        {
                            this.props.rounds.map((r, i) => (
                                <td key={i}>
                                    {i + 1 === this.props.rounds.length && <button className="btn btn-danger" onClick={this.onEpidemic}>Epidemic</button>}
                                </td>
                            ))
                        }
                    </tr>
                </tbody>
            </table>
        );
    }

    private onCityDecrement(city: string): void {
        this.onCountChanged(city, -1);
    }

    private onCityIncrement(city: string): void {
        this.onCountChanged(city, +1);
    }

    private onCountChanged(city: string, value: number): void {
        if (this.props.onCountChanged) {
            this.props.onCountChanged(city, this.props.initialCities[city] + value);
        }
    }

    private captureNewCityInputRef(input: HTMLInputElement): void {
        this.newCityInput = input;
    }

    private onNewCityAdd(): void {
        if (this.props.onCityAdd) {
            this.props.onCityAdd(this.newCityInput.value);
        }

        this.newCityInput.value = "";
    }

    private onRoundDecrement(roundIndex: number, city: string) {
        this.onRoundCountChanged(roundIndex, city, -1);
    }

    private onRoundIncrement(roundIndex: number, city: string) {
        this.onRoundCountChanged(roundIndex, city, +1);
    }

    private onRoundCountChanged(roundIndex: number, city: string, change: number): void {
        if (this.props.onRoundCountChanged) {
            this.props.onRoundCountChanged(roundIndex, city, this.props.rounds[roundIndex][city] + change);
        }
    }

    private getRoundCols(city: string): JSX.Element[] {
        return this.props.rounds.map((round, i) => (
            <td key={i}>
                {i + 1 === this.props.rounds.length && <button className="btn btn-sm btn-outline-primary" onClick={this.onRoundDecrement.bind(this, i, city)}>-</button>}
                <span style={{margin: "0 5px 0 5px"}}>{round[city]}</span>
                {i + 1 === this.props.rounds.length && <button className="btn btn-sm btn-outline-primary" onClick={this.onRoundIncrement.bind(this, i, city)}>+</button>}
            </td>
        ));
    }

    private onEpidemic(): void {
        if (this.props.onEpidemic) {
            this.props.onEpidemic(0);
        }
    }
}
