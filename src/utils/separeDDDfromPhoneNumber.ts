/**
 *
 * separa o DDD do número de telefone
 *
 */

export const separeDDDFromPhoneNumber = (phoneNumber: string) => {
  let removeParentesesPhoneNumber = phoneNumber.replace(/\(|\)/g, '');
  let removeSeparatorPhoneNumber = removeParentesesPhoneNumber.replace('-', '');
  let removeSpacePhoneNumber = removeSeparatorPhoneNumber.replace(' ', '');

  let dddPhoneNumber = removeSpacePhoneNumber.substring(0, 2);
  let phoneWithoutDDD = removeSpacePhoneNumber.substring(2, 11);

  return { dddPhoneNumber: Number(dddPhoneNumber), phoneNumber: Number(phoneWithoutDDD) };
};
