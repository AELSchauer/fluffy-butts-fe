const findOne = (includedList, findRecord) =>
  includedList.find(
    (record) => findRecord.id === record.id && findRecord.type === record.type
  );

const findMany = (includedList, findRecords) =>
  includedList.filter((record) =>
    findRecords.includes(
      (findRecord) =>
        findRecord.id === record.id && findRecord.type === record.type
    )
  );

export { findOne, findMany };
