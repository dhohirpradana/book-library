import { graphRequest } from "../configs/api";
import createdAtFormat from "../constants/createdAtFormat";

export default function orderValidation(userId, start, due, bookId) {
  console.log(userId);
  // console.log(createAtFormat(new Date()));
  let tom = new Date();
  tom.setDate(tom.getDate() + 1);
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
        // dateStart_gte: start,
        // dueDate_lte: due,
        createdAt_gte: createdAtFormat(new Date()),
        createdAt_lte: createdAtFormat(tom),
      },
    }
  ).then((res) => {
    if (res.data.orders.length >= max)
      return alert(
        "Order limit per day reached!\nYour orders: " + res.data.orders.length
      );
    graphRequest(
      `query($where: BorrowFilter) {
        borrows(where: $where) {
          status
        }
      }         
      `,
      { where: { userId } }
    ).then((res) => {
      console.log("borrows", res.data.borrows.length);
      if (res.data.borrows.length >= max)
        return alert(
          "Limit borrow reached!\nYour borrows: " + res.data.borrows.length
        );
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
            bookId: bookId,
          },
        }
      ).then((res) => alert("Order Successfully"));
    });
  });
}
