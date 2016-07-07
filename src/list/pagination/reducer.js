import {
    CRUD_NEXT_PAGE,
    CRUD_PREV_PAGE,
    CRUD_GOTO_PAGE,
} from './actions';
import { CRUD_FETCH_LIST_SUCCESS } from '../data/actions';

const initialState = {
    page: 1,
    perPage: 10,
    total: 0,
};

export default (resource) => (previousState = initialState, { type, payload, meta }) => {
    if (!meta || meta.resource !== resource) {
        return previousState;
    }
    const nbPages = Math.ceil(previousState.total / previousState.perPage) || 1;
    switch (type) {
    case CRUD_FETCH_LIST_SUCCESS:
        return { ...previousState, total: parseInt(payload.headers['content-range'].split('/').pop(), 10) };
    case CRUD_NEXT_PAGE:
        if (previousState.page === nbPages) {
            throw new Error('Cannot got to next page: pagination already at last page');
        }
        return { ...previousState, page: previousState.page + 1 };
    case CRUD_PREV_PAGE:
        if (previousState.page === 1) {
            throw new Error('Cannot got to previous page: pagination already at first page');
        }
        return { ...previousState, page: previousState.page - 1 };
    case CRUD_GOTO_PAGE:
        if (payload.page > nbPages) {
            throw new Error(`Cannot got to a page higher than total (${previousState.total})`);
        }
        if (payload.page < 1) {
            throw new Error('Cannot got to to a page lower than 1');
        }
        return { ...previousState, page: parseInt(payload.page, 10) };
    default:
        return previousState;
    }
};