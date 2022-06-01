import { graphRequest } from "../configs/api";
import createdAtFormat from "../constants/createdAtFormat";

export default function orderValidation(userId, start, due, bookId) {
  // console.log(userContext.user.id);
  // console.log(createAtFormat(new Date()));
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
        userId: userId,
        dateStart_gte: start,
        dueDate_lte: due,
        createdAt_gte: createdAtFormat(new Date()),
        // createdAt_lte: "2022-04-13T15:08:56.370Z",
      },
    }
  ).then((res) => {
    console.log(res.data.orders.length);
    if (res.data.orders.length < max) {
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
    } else {
      alert("Order Limited!");
    }
  });
}
