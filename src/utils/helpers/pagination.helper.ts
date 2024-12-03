export function paramPaginate(params: any) {
  const page = Number(params.page) || 1;
  const per_page = Number(params.per_page) || 10;
  const skip = (page - 1) * per_page;
  const take = per_page;

  return {
    page,
    per_page,
    skip,
    take,
  }
}

export function paginationResponse(total: number, data: any, per_page: number, page: number, skip: number) {
  const last_page = Math.ceil(total / per_page);
  const from = skip + 1;
  const to = Math.min(skip + per_page, total);

  return {
    items: data,
    meta: {
      pagination: {
        total,
        per_page,
        current_page: page,
        last_page,
        from,
        to,
      },
    },
  };
}