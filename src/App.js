import React, { useState, useEffect } from 'react';
import './App.css';
import packageJson from './../package.json';
import preval from 'preval.macro';
//import Lesson from './atWork/Lesson';
import Tabs from './atWork/Tabs';
import 'semantic-ui-css/semantic.min.css'
import { fromFetch } from "rxjs/fetch";
import { retry } from "rxjs/operators";

function App() {
  const [githubVersion, setGithubVersion] = useState("--")
  useEffect(() => {
    const observable = fromFetch("https://raw.githubusercontent.com/ar-insoft/at-work/master/package.json").pipe(retry(3))
    observable.subscribe(response => {response.json()
      .then((json) => {
        //console.log("fromFetch.json", json)
        setGithubVersion(json.version)
      })
    })
  }, [])
  //const githubPackageJson = fromFetch("https://raw.githubusercontent.com/ar-insoft/at-work/master/package.json")
  //  .pipe(retry(3)).subscribe((json) => setGithubVersion(json.version));
  //const githubVersion = githubPackageJson ? githubPackageJson.version : "--";
  return (
    <div className="App" data_build_version={packageJson.version} data_github_version={githubVersion} data_build_time={preval`module.exports = new Date().toISOString();`}>
      <Tabs />
      {/* <Lesson epNo={'30'}/> */}
    </div>
  );
}

export default App;
