export const applyMiddleware =
    (...middleware) =>
    async (...apiArgs) => {
        let offset = 0;
        let result;
        const promises = [];
        const next = () => {
            const nextMiddleware = middleware[offset++];
            if (offset < middleware.length) {
                promises.push(nextMiddleware(...apiArgs, next));
            } else {
                result = nextMiddleware(...apiArgs);
            }
        };
        next();
        if(!result){
            return await Promise.all(promises);
        }

        return result;
    };
