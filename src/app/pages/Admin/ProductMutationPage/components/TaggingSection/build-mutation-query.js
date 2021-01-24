export default ({ id, tagId, taggableId, taggableType }) => {
  return `id${id}:CreateTagging(tag_id:"${tagId}" taggable_id:"${taggableId}" taggable_type:"${taggableType}"){id name}}"`;
};
