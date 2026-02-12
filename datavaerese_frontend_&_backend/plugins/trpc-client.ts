import { TRPCLink } from '@trpc/client';
import { observable } from '@trpc/server/observable';
import superjson from 'superjson'
import { createTRPCNuxtClient, httpLink } from 'trpc-nuxt/client'
import type { AppRouter } from '~~/server/trpc/routers'
import { hideLoader, showLoader } from '~/types/Loader';
import { useNotification } from 'naive-ui';

export const customLink: TRPCLink<AppRouter> = () => {
  return ({ next, op }) => {
    return observable((observer) => {
      const notification = useNotification();
      showLoader();
      const unsubscribe = next(op).subscribe({
        next(value) {
          observer.next(value);
        },
        error(err) {
          hideLoader();

          // Check if error is 401 Unauthorized
          if (err.data?.httpStatus === 401) {
            notification.error({
              title: 'Unauthorized',
              content: 'You are not authorized to access this resource.',
              duration: 5000, // Toast duration
            });
          }

          observer.error(err);
        },
        complete() {
          hideLoader();
          observer.complete();
        },
      });
      return unsubscribe;
    });
  };
};

export default defineNuxtPlugin(() => {
  const client = createTRPCNuxtClient<AppRouter>({
    transformer: superjson,
    links: [
      customLink,
      httpLink(),
    ],
  })

  return {
    provide: {
      client,
    },
  }
})
