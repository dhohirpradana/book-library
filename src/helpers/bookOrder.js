import { graphRequest } from "../configs/api";
import createdAtFormat from "../constants/createdAtFormat";

export default function bookOrder(userId, start, due, bookId) {
  console.log(userId);
  console.log(bookId);
  console.log(start);
  console.log(due);
  // console.log(createAtFormat(new Date()));
  start.setHours(0, 0, 0, 0);
  due.setHours(23, 59, 59, 0);

  let tom = new Date();
  tom.setHours(23, 59, 59, 0);

  let td = new Date();
  tom.setHours(0, 0, 0, 0);
  // console.log(tom);
  let max = 3;
  graphRequest(
    `query($where:OrderFilter){
      orders(where:$where) {
        id
      }
    }
    `,
    {
      where: {
        userId,
        createdAt_gte: createdAtFormat(td),
        createdAt_lte: createdAtFormat(tom),
      },
    }
  ).then((res) => {
    if (res.data.orders.length >= max)
      return alert(
        "Order limit per day reached!\nYour orders: " + res.data.orders.length
      );
    graphRequest(
      `
    query($where: BorrowFilter, $orderBy: BorrowOrderBy) {
      borrows(where: $where, orderBy: $orderBy) {
        id
        user {
          firstName
        }
        book {
          id
          code
          name
        }
        status
        dateStart
        dueDate
      }
    }`,
      {
        where: {
          userId,
          bookId,
          status: "BORROWED",
          dueDate_lte: start,
        },
      }
    ).then((res) => {
      // console.log(userId, bookId, start, due);
      console.log("Book order at same time: ", res.data.borrows.length);
      if (res.data.borrows.length > 0)
        return alert("Unable to order this book at same time!");
      graphRequest(
        `query($where: BorrowFilter) {
          borrows(where: $where) {
            status
          }
        }         
        `,
        { where: { userId, status: "BORROWED" } }
      ).then((res) => {
        // console.log("borrows", res.data.borrows.length);
        if (res.data.borrows.length >= max)
          return alert(
            "Limit borrow reached!\nYour borrows: " + res.data.borrows.length
          );
        graphRequest(
          `
          query($where: OrderFilter, $orderBy: OrderOrderBy) {
            orders(where: $where, orderBy: $orderBy) {
              id
              user {
                firstName
              }
              book {
                id
                code
                name
              }
              status
              dateStart
              dueDate
            }
          }`,
          {
            where: {
              userId,
              bookId,
              status: "PENDING",
              dueDate_lte: start,
            },
          }
        ).then((res) => {
          console.log("Book order at same time: ", res.data.orders.length);
          if (res.data.orders.length > 0)
            return alert("You already have an order for this book!");
          graphRequest(
            `mutation($input: CreateOrderInput!) {
            createOrder(input: $input){
              status
            }
          }
          `,
            {
              input: {
                dateStart: start,
                dueDate: due,
                bookId,
              },
            }
          ).then((res) => {
            console.log(res.data);
            if (res.data.createOrder == null)
              return alert("You cannot order more than 3 books at same time!");
            window.location.reload();
            alert("Order Successfully");
          });
        });
      });
    });
  });
}
