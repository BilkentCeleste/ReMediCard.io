package com.celeste.remedicard.io.search.repository;

import com.celeste.remedicard.io.search.entity.SearchableDeck;
import org.springframework.data.elasticsearch.annotations.Query;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SearchableDeckRepository extends ElasticsearchRepository<SearchableDeck, Long> {


    @Query("""
            {
              "bool": {
                "must": [
                    { "term": { "userId": "?1" } }
                  ],
                "should": [
                  { "match": { "name": "?0" }},
                  { "match": { "description": "?0" }},
                  {
                    "nested": {
                      "path": "flashcards",
                      "query": {
                        "bool": {
                          "should": [
                            { "match": { "flashcards.front": "?0" }},
                            { "match": { "flashcards.back": "?0" }}
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
    List<SearchableDeck> findSearchableDeckContaining(String keyword, Long userId);


    @Query("""
            {
              "bool": {
                "must_not": [
                    { "term": { "userId": "?1" } }
                  ],
                "should": [
                  { "match": { "name": "?0" }},
                  { "match": { "description": "?0" }},
                  {
                    "nested": {
                      "path": "flashcards",
                      "query": {
                        "bool": {
                          "should": [
                            { "match": { "flashcards.front": "?0" }},
                            { "match": { "flashcards.back": "?0" }}
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
    List<SearchableDeck> findSearchableDeckContainingButNotOwnedBy(String keyword, Long userId);



}
