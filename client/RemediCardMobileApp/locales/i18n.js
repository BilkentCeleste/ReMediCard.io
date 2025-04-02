import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import login_en from "./en/login.json";
import register_en from "./en/register.json";
import forgot_password_en from "./en/forgot_password.json";
import not_found_en from "./en/not_found.json";
import home_en from "./en/home.json";
import profile_en from "./en/profile.json";
import contact_us_en from "./en/contact_us.json";
import delete_account_en from "./en/delete_account.json";
import edit_profile_en from "./en/edit_profile.json";
import goal_list_en from "./en/goal_list.json";
import study_dashboard_en from "./en/study_dashboard.json";
import update_deck_en from "./en/update_deck.json";
import update_flashcard_en from "./en/update_flashcard.json";
import update_quiz_question_en from "./en/update_quiz_question.json";
import quiz_question_en from "./en/quiz_question.json";
import quizzes_en from "./en/quizzes.json";
import create_goal_en from "./en/create_goal.json";
import decks_en from "./en/decks.json";
import deck_results_en from "./en/deck_results.json";
import edit_deck_list_en from "./en/edit_deck_list.json";
import edit_quiz_en from "./en/edit_quiz.json";
import generate_decks_en from "./en/generate_decks.json";
import card_en from "./en/card.json";

import login_tr from "./tr/login.json";
import register_tr from "./tr/register.json";
import forgot_password_tr from "./tr/forgot_password.json";
import not_found_tr from "./tr/not_found.json";
import home_tr from "./tr/home.json";
import profile_tr from "./tr/profile.json";
import contact_us_tr from "./tr/contact_us.json";
import delete_account_tr from "./tr/delete_account.json";
import edit_profile_tr from "./tr/edit_profile.json";
import goal_list_tr from "./tr/goal_list.json";
import study_dashboard_tr from "./tr/study_dashboard.json";
import update_deck_tr from "./tr/update_deck.json";
import update_flashcard_tr from "./tr/update_flashcard.json";
import update_quiz_question_tr from "./tr/update_quiz_question.json";
import quiz_question_tr from "./tr/quiz_question.json";
import quizzes_tr from "./tr/quizzes.json";
import create_goal_tr from "./tr/create_goal.json";
import decks_tr from "./tr/decks.json";
import deck_results_tr from "./tr/deck_results.json";
import edit_deck_list_tr from "./tr/edit_deck_list.json";
import edit_quiz_tr from "./tr/edit_quiz.json";
import generate_decks_tr from "./tr/generate_decks.json";
import card_tr from "./tr/card.json";

i18n.use(initReactI18next).init({
  resources: {
    en: { 
        login: login_en,
        register: register_en,
        forgot_password: forgot_password_en,
        not_found: not_found_en,
        home: home_en,
        profile: profile_en,
        contact_us: contact_us_en,
        delete_account: delete_account_en,
        edit_profile: edit_profile_en,
        goal_list: goal_list_en,
        study_dashboard: study_dashboard_en,
        update_deck: update_deck_en,
        update_flashcard: update_flashcard_en,
        update_quiz_question: update_quiz_question_en,
        quiz_question: quiz_question_en,
        quizzes: quizzes_en,
        create_goal: create_goal_en,
        decks: decks_en,
        deck_results: deck_results_en,
        edit_deck_list: edit_deck_list_en,
        edit_quiz: edit_quiz_en,
        generate_decks: generate_decks_en,
        card: card_en,
    },
    tr: {
        login: login_tr,
        register: register_tr,
        forgot_password: forgot_password_tr,
        not_found: not_found_tr,
        home: home_tr,
        profile: profile_tr,
        contact_us: contact_us_tr,
        delete_account: delete_account_tr,
        edit_profile: edit_profile_tr,
        goal_list: goal_list_tr,
        study_dashboard: study_dashboard_tr,
        update_deck: update_deck_tr,
        update_flashcard: update_flashcard_tr,
        update_quiz_question: update_quiz_question_tr,
        quiz_question: quiz_question_tr,
        quizzes: quizzes_tr,
        create_goal: create_goal_tr,
        decks: decks_tr,
        deck_results: deck_results_tr,
        edit_deck_list: edit_deck_list_tr,
        edit_quiz: edit_quiz_tr,
        generate_decks: generate_decks_tr,
        card: card_tr,
    },
  },
  lng: "tr", // default language
  fallbackLng: "en", // if a language is not available
  interpolation: {
    escapeValue: false, 
  },
});

export default i18n;