import { applyMiddleware } from '../applyMiddleware';

describe('Test applyMiddleware', () => {
    it('should pass single middleware', async () => {
        const mw = (next) => {
            next();
        };
        const getString = () => 'should pass single middleware';
        const execResolver = applyMiddleware(mw, getString);

        expect(await execResolver()).toEqual('should pass single middleware');
    });

    it('should pass multiple middleware', async () => {
        const mw = (next) => next();
        const mw2 = (next) => next();
        const getString = () => 'middleware passed';
        const execResolver = applyMiddleware(mw, mw2, getString);

        expect(await execResolver()).toEqual('middleware passed');
    });

    it('should fail if any of the middleware does not call next()', async () => {
        const mw = (next) => {};
        const mw2 = (next) => next();
        const getString = () => 'middleware passed';
        const execResolver = applyMiddleware(mw, mw2, getString);

        expect(await execResolver()).toBeUndefined();
        expect(await execResolver()).not.toBe('middleware passed');
    });

    it('should pass with auth and permission middleware', async () => {
        const removePost = () => 'Removed';
        const myRemovePostResolver = applyMiddleware(
            ...withDefaults({ resource: 'post', action: 'remove' }),
            removePost
        );

        expect(
            await myRemovePostResolver(null, null, { user: { role: 'admin' } })
        ).toBe('Removed');
    });

    it('should pass with async middleware', async () => {
        const checkOwnershipMw = async (ctx, next) => {
            try {
                const post = await createPromise({ id: 1, userId: 2 }, 500);
                next();
            } catch (err) {
                console.log(err);
            }
        };
        const updatePost = () => createPromise('updated', 500);
        const execResolver = applyMiddleware(checkOwnershipMw, updatePost);
        const result = await execResolver({ user: { id: 1 } });

        expect(result).toBe('updated');
    });
});

function withDefaults({ resource, action }) {
    const authMw = (_, __, ctx, next) => {
        if (ctx.user.role) {
            next();
        }
    };

    const AcMw = (_, args, ctx, next) => {
        const acMock = {
            post: {
                remove: {
                    admin: true,
                    editor: false,
                    author: false,
                },
            },
        };
        const role = ctx.user.role;

        if (acMock[resource][action][role]) {
            next();
        }
    };

    return [authMw, AcMw];
}

function createPromise(data, ms) {
    return new Promise((resolve) => {
        setTimeout(() => resolve(data), ms);
    });
}
