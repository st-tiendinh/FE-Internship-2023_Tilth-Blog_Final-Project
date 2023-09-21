import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { ApiService } from '../../../../core/services/api.service';
import { ENDPOINT } from '../../../../../config/endpoint';
import { formatDate } from '../../../../shared/utils/formatDate';
import { isImageUrlValid } from '../../../../shared/utils/checkValidImage';
import BlankPostImg from '../../../../../assets/images/blank-post.png';
import BlankUserImg from '../../../../../assets/images/blank-user.webp';

export const RecommendPosts = () => {
  const apiService = new ApiService();

  const [recommendPosts, setRecommendPosts] = useState<any[]>([]);
  const [isValidCovers, setIsValidCovers] = useState<boolean[]>([]);
  const [isValidAvatars, setIsValidAvatars] = useState<boolean[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const skeletonArray = Array.from({ length: 3 }, (_, index) => index + 1);

  useEffect(() => {
    setIsLoading(true);
    apiService
      .get([ENDPOINT.posts.recommend], { page: 2, size: 3 })
      .then((response: any) => {
        setRecommendPosts(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    Promise.all(recommendPosts.map((post) => isImageUrlValid(post.cover)))
      .then((validities) => {
        setIsValidCovers(validities);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [recommendPosts]);

  useEffect(() => {
    Promise.all(
      recommendPosts.map((post) => isImageUrlValid(post.user.picture))
    )
      .then((validities) => {
        setIsValidAvatars(validities);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [recommendPosts]);

  return (
    <section className="section recommend-section">
      {isLoading
        ? skeletonArray.map((item) => (
            <div key={item} className="article skeleton"></div>
          ))
        : recommendPosts.map((post, index) => {
            const isValidCover = isValidCovers[index];
            const isValidAvatar = isValidAvatars[index];
            return (
              <div className="article">
                <Link
                  to={`/articles/${post.id}`}
                  className="article-image-wrapper"
                >
                  <div className="overlay"></div>
                  <img
                    src={isValidCover ? post.cover : BlankPostImg}
                    alt={post.description}
                    className="article-image"
                  />
                </Link>
                <div className="article-content">
                  <ul className="d-flex tag-list">
                    {post.tags.map((tag: any) => {
                      return (
                        <li className="tag-item">
                          <Link to={`articles/tag/${tag}`} className="tag-link">
                            <div className="badge badge-primary tag">{tag}</div>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                  <Link to={`/articles/${post.id}`}>
                    <h3
                      className={`article-title title-${index} text-truncate`}
                    >
                      {post.title}
                    </h3>
                  </Link>
                  <div className="d-flex article-about">
                    <Link
                      to={`/users/${post.user.id}`}
                      className="d-flex article-author"
                    >
                      <div className="author-avatar-wrapper">
                        <img
                          src={isValidAvatar ? post.user.picture : BlankUserImg}
                          alt={post.user.displayName + ' avatar'}
                          className="author-avatar"
                        />
                      </div>
                      <p className="author-name">{post?.user?.displayName}</p>
                    </Link>
                    <span className="dot-symbol">&#x2022;</span>
                    <p className="article-date">{formatDate(post.createdAt)}</p>
                  </div>
                </div>
              </div>
            );
          })}
    </section>
  );
};