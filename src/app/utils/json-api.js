const findOne = (includedList, findRecord) =>
  includedList.find(
    (record) => findRecord.id === record.id && findRecord.type === record.type
  );

const findMany = (includedList, findRecords) =>
  findRecords
    .map((findRecord) =>
      includedList.find(
        (record) =>
          findRecord.id === record.id && findRecord.type === record.type
      )
    )
    .filter(Boolean);

export { findOne, findMany };
