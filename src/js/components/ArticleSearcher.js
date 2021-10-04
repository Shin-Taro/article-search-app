import React, { useEffect, useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import Article from "./Article";
import Container from "./Container";
import Controller from "./Controller";
import Header from "./Header";
import List from "./List";
import Presets from "./Presets";
import Search from "./Search";
import SignOut from "./SignOut";
import { Redirect } from 'react-router-dom';

const ACCESS_TOKEN = process.env.ACCESS_TOKEN;

const ArticleSearcher = () => {
  const blockName = "articleSearcher";
  const [loading, setLoading] = useState(true);
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState(null);
  const [keyWord, setKeyWord] = useState("新着");
  const [count, setCount] = useState(1);
  const [value, setValue] = useState("created%3A%3E2021-08-01");
  const { user } = useAuthContext();

  const firstHalf = `https://qiita.com/api/v2/items?page=`;
  const latterHalf = `&per_page=10&query=`;
  const qiitaUrl = `https://qiita.com/api/v2/items?page=${count}&per_page=10&query=`
  const requestUrl = firstHalf + count + latterHalf + value;

  let unmounted = false;

  const requestApi = (url) => {
    fetch(url,
      {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
        },
      }
    )
    .then(response => {
      if(!response.ok){
        throw new Error(response);
      }
      console.log(response);
      return response.json();
    })
    .then(json => {
      if(!unmounted){
        setArticles(json);
        setLoading(false);
      }else{
        return false;
      }
    })
    .catch(error => {
      if(!unmounted){
        setError(error);
        setLoading(false);
        console.log(error);
      }else{
        return false;
      }
    });
  };

  useEffect(() => {
    requestApi(requestUrl);
    return () => {unmounted = true};
  }, []);

  const searchArticles = value => {
    const escapedValue = encodeURIComponent(value);
    const requestUrl = qiitaUrl + escapedValue;
    setValue(escapedValue);
    setCount(1);
    setLoading(true);
    setError(null);
    setKeyWord(value);
    requestApi(requestUrl);
  };

  const runPresets = preset => {
    const requestUrl = qiitaUrl + preset.value;
    setValue(preset.value);
    setCount(1);
    setLoading(true);
    setError(null);
    setKeyWord(preset.name);
    requestApi(requestUrl);
  };

  const turnPage = e => {
    const currentArrow = e.currentTarget.dataset.arrow;
    let pageCount = count;
    switch (currentArrow) {
      case "prev":
        pageCount--
        break;
      case "next":
        pageCount++
        break;
      default:
        break;
    }
    const url = firstHalf + pageCount + latterHalf + value;
    setCount(pageCount);
    requestApi(url);
  };

  const renderArticles = () => {
    let elements;
    if (error) {
      elements =  <div className={`${blockName}__message`}>{error.message}</div>
    } else if (loading) {
      elements = <div className={`${blockName}__message`}>Now loading...</div>
    } else if (articles.length === 0){
      elements = <div className={`${blockName}__message`}>検索結果：該当なし</div>
    } else {
      elements = articles.map(article => {
        return(
          <li key={article.id} className="list__item">
            <Article
              article={article}
            />
          </li>
        );
      });
    }
    return elements;
  };

  if(!user){
    return <Redirect to="/signin" />;
  }else{
    return (
      <div className={blockName}>
        <Header />
        <SignOut />
        <Search
          searchArticles={searchArticles}
        />
        <Presets
          runPresets={runPresets}
        />
        <Container>
          <h1 className="container__title">{keyWord}</h1>
          <Controller
            count={count}
            onClick={turnPage}
          />
          <List
            renderItems={renderArticles}
          />
        </Container>
      </div>
    );
  };
};

export default ArticleSearcher;