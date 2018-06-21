import * as React from 'react';

export interface ICitySelectorProps {
    cities: string[];
    cityProbabilities: {[city: string]: number};
    onCitySelected?: (city: string) => void;
}

export class CitySelector extends React.Component<ICitySelectorProps, {}> {
    constructor(props: ICitySelectorProps) {
        super(props);
    }

    public render(): JSX.Element {
        return (
            <table className="table table-bordered table-dark table-striped">
                <thead>
                    <tr>
                        <th>Epidemic City</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        this.props.cities.map(c => (
                            <tr key={c}>
                                <td>
                                    <button
                                        className="btn btn-block btn-danger"
                                        disabled={this.props.cityProbabilities[c] === 0}
                                        onClick={this.onCitySelected.bind(this, c)}
                                    >
                                        {c}
                                    </button>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        );
    }

    private onCitySelected(city: string): void {
        if (this.props.onCitySelected) {
            this.props.onCitySelected(city);
        }
    }
}
