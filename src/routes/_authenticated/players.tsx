import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useInfiniteQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router'
import React from 'react';
import { useInView } from 'react-intersection-observer';

export const Route = createFileRoute('/_authenticated/players')({
  component: DashboardComponent,
})

function DashboardComponent() {
  const { ref, inView } = useInView()

  const {
    status,
    data,
    error,
    isFetching,
    isFetchingNextPage,
    isFetchingPreviousPage,
    fetchNextPage,
    fetchPreviousPage,
    hasNextPage,
    hasPreviousPage,
  } = useInfiniteQuery({
    queryKey: ['players'],
    queryFn: async ({
      pageParam,
    }): Promise<{
      data: Array<any>
      previousId: number
      nextId: number
    }> => {
      console.log(pageParam);
      const response = await fetch(`https://api.balldontlie.io/v1/players?per_page=10&cursor=${pageParam}`, { headers: { 'Authorization': '124602cd-84f3-4c6f-a1e5-5e21181f99f9' } })
      return await response.json()
    },
    initialPageParam: 0,
    getPreviousPageParam: (firstPage: any) => {
      return firstPage.meta.next_cursor - 20
    },
    getNextPageParam: (lastPage: any) => {
      return lastPage.meta.next_cursor
    },
  })

  React.useEffect(() => {
    if (inView) {
      fetchNextPage()
    }
  }, [fetchNextPage, inView])

  return (
    <div>
      <h1>Players</h1>
      {status === 'pending' ? (
        <p>Loading...</p>
      ) : status === 'error' ? (
        <span>Error: {error.message}</span>
      ) : (
        <>
          <div>
            <button
              onClick={() => fetchPreviousPage()}
              disabled={!hasPreviousPage || isFetchingPreviousPage}
            >
              {isFetchingPreviousPage
                ? 'Loading more...'
                : hasPreviousPage
                  ? 'Load Older'
                  : 'Nothing more to load'}
            </button>
          </div>
          <div className='grid grid-cols-4 gap-1'>
            {data.pages.map((page) => (
              <React.Fragment key={page.nextId}>
                {page.data.map((player) => (
                  <Card key={player.id}>
                    <CardHeader>
                      <CardTitle>Card Title</CardTitle>
                      <CardDescription>Card Description</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p>Card Content</p>
                    </CardContent>
                    <CardFooter>
                      <p>Card Footer</p>
                    </CardFooter>
                  </Card>
                ))}
              </React.Fragment>
            ))}
          </div>
          <div>
            <button
              ref={ref}
              onClick={() => fetchNextPage()}
              disabled={!hasNextPage || isFetchingNextPage}
            >
              {isFetchingNextPage
                ? 'Loading more...'
                : hasNextPage
                  ? 'Load Newer'
                  : 'Nothing more to load'}
            </button>
          </div>
          <div>
            {isFetching && !isFetchingNextPage
              ? 'Background Updating...'
              : null}
          </div>
        </>
      )}
      <hr />
    </div>
  )
}