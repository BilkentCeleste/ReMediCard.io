package com.celeste.remedicard.io.search.repository;

import com.celeste.remedicard.io.search.entity.SearchableQuiz;
import org.springframework.data.elasticsearch.annotations.Query;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SearchableQuizRepository extends ElasticsearchRepository<SearchableQuiz, Long> {
    @Query("""
            {
              "bool": {
                "must": [
                      { "term": { "userId": "?1" } }
                    ],
                "should": [
                  { "match": { "name": "?0" }},
                  {
                    "nested": {
                      "path": "questions",
                      "query": {
                        "bool": {
                          "should": [
                            { "match": { "question.description": "?0" }},
                            { "match": { "question.options": "?0" }}
                          ]
                        }
                      }
                    }
                  }
                ],
                "minimum_should_match": 1
              }
            }
            """)
    List<SearchableQuiz> findSearchableQuizContaining(String keyword, Long userId);


    @Query("""
            {
              "bool": {
                "filter": [
                      { "term": { "userId": "?1" } }
                    ],
                "should": [
                  { "match": { "name": "?0" }},
                  {
                    "nested": {
                      "path": "questions",
                      "query": {
                        "bool": {
                          "should": [
                            { "match": { "question.description": "?0" }},
                            { "match": { "question.options": "?0" }}
                          ]
                        }
                      }
                    }
                  }
                ],
                "minimum_should_match": 1
              }
            }
            """)
    List<SearchableQuiz> findSearchableQuizContainingButNotOwnedBy(String keyword, Long userId);
}
