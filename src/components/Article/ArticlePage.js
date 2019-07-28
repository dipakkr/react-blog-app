import React from 'react';

import ArticleContent from './ArticleContent';
import NotFound from '../NotFound/NotFound';

const ArticlePage = ({match}) => {
    
    const name = match.params.name;
    const article = ArticleContent.find(article => article.name === name);

    if(!article) return <NotFound/>;

    return(
        <>
            <h2>{article.title}</h2>
            <p> {article.content} </p>
        </>
    );
}

export default ArticlePage;