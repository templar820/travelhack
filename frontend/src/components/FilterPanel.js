import React from 'react';
import { inject, observer } from 'mobx-react';
import { StoresNames } from '@/services/common/constDictionary';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { withStyles } from '@material-ui/core/styles';
import 'react-dates/initialize';
import { DateRangePicker, SingleDatePicker, DayPickerRangeController } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';
import {Button, ButtonGroup, Card} from "react-bootstrap";
import LanguageIcon from '@material-ui/icons/Language';
import InputAdornment from "@material-ui/core/InputAdornment";
import {AccountCircle} from "@material-ui/icons";
import Emoji from "a11y-react-emoji";


export function countryToFlag(isoCode) {
  if (!isoCode)return null;
  return typeof String.fromCodePoint !== 'undefined'
      ? isoCode
          .toUpperCase()
          .replace(/./g, (char) => String.fromCodePoint(char.charCodeAt(0) + 127397))
      : isoCode;
}

const styles = (theme) => ({
  formControl: {
  },
});


class FilterPanel extends React.Component {
  constructor(props) {
    super(props);
    this.store = this.props[StoresNames.FilterStore];
    this.state = this.getDefaultState();
  }
  
  componentDidMount() {
    this.props.services.requestService.getTourList({...this.state});
  }
  
  
  getDefaultState(){
    return {
      openCountries: null,
      country: null,
      user_id: null,
      openUsers: null,
      gender: null,
      age: null,
    }
  }
  
  update(key, value){
    this.setState(state => {
     return {...state, [key]: value}
    })
  }
  
  render() {
    const classes = this.props.classes;
    const user = this.store.users.find(el => el.user_id === this.state.user_id) || null;

    return (
      <div className="col-md-3">
        <h2 className="grid-title">
          <i className="fa fa-filter" />
          {' '}
          Фильтры
        </h2>
        <hr />
        {/* BEGIN FILTER BY CATEGORY */}
        <Card className={"mb-4 mt-3"}>
          <Card.Body className="filtersPanel">
            <h4>Авторизация:</h4>
            <Autocomplete
              open={this.state.openUsers}
              onOpen={() => {
                this.props.services.requestService.getUsers().then(() => {
                  this.setState({openUsers: true})
                })
              }}
    
              onClose={() => {
                this.setState({openUsers: false})
              }}
              value={user || null}
              getOptionSelected={(option, value) => option.user_id === value}
              getOptionLabel={(option) => String(option.user_id)}
              options={this.store.users}
              renderOption={(option) => (
                <React.Fragment>
                  ID Пользователя: {option.user_id}
                </React.Fragment>
              )
              }
              onChange={(e, obj) => {this.update("user_id", obj?.user_id || null)}}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={"Выберите пользователя"}
                  key="Asynchronous"
                  variant="outlined"
                  InputProps={{
                    ...params.InputProps,
                    startAdornment:(
                      <InputAdornment position="start">
                        <AccountCircle />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <React.Fragment>
                        {params.InputProps.endAdornment}
                      </React.Fragment>
                    ),
                  }}
                />
              )}
            />
            {user?.gender &&
            <div className={"emojiLine d-flex flex-row align-items-center"} style={{alignItems: "flex-start"}}>
              <Emoji symbol={(user.gender === "женский")? "👸": "👲"}/>
              <h5 className={"font-weight-bold"}>{user.gender}</h5>
            </div>
            }
            {user?.age && <h5 className={"font-weight-bold"}>Возраст: {user.age}</h5>}
          </Card.Body>
        </Card>
        <Card>
          <Card.Body>
            <h4>Категории:</h4>
            <Autocomplete
              open={this.state.openCountries}
              onOpen={() => {
                this.props.services.requestService.getCountries().then(() => {
                  this.setState({openCountries: true})
                })
              }}
              onClose={() => {
                this.setState({openCountries: false})
              }}
              value={this.store.countries.find(el => el.value ===this.state.country) || null}
              getOptionSelected={(option, value) => option.value === value.value}
              getOptionLabel={(option) => option.value}
              options={this.store.countries}
              renderOption={(option) => (
                <React.Fragment>
                  <span className={"mr-2"}>{option.code && countryToFlag(option.code)}</span>
                  {option.value}
                </React.Fragment>
              )}
              onChange={(e, element) => {this.update("country", element?.value)}}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={"Выберите страну"}
                  key="Asynchronous"
                  variant="outlined"
                  InputProps={{
                    ...params.InputProps,
                    startAdornment:(
                      <InputAdornment position="start">
                        <LanguageIcon />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <React.Fragment>
                        {params.InputProps.endAdornment}
                      </React.Fragment>
                    ),
                  }}
                />
              )}
            />
  
            <div className={"mt-4 d-flex flex-row justify-content-between flex-wrap"}>
              <Button variant={"link"} style={{padding: "0px"}} onClick={() => {
                this.setState(this.getDefaultState());
              }}>Очистить</Button>
              <Button variant={"primary"} onClick={() => {
                this.props.services.requestService.getTourList({...this.state});
              }}>Найти</Button>
            </div>
          </Card.Body>
        </Card>
      </div>

    );
  }
}

export default inject("services", StoresNames.FilterStore)(withStyles(styles)((observer(FilterPanel))))